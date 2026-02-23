import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from "expo-router";
import { getAll, getOne, update, insert, getTareasParaRecorrida } from "@/db/operations";
import { MapView, Polygon, Marker, PROVIDER_DEFAULT } from "@/components/map/MapComponents";
import { useLocation } from "@/hooks/useLocation";
import { parseGeometry, parseGeometryMulti, parseFeatureCollection, getCentroid } from "@/lib/geo";
import { LayerToggle, type LayerVisibility } from "@/components/map/LayerToggle";
import { ProgressBar } from "@/components/recorrida/ProgressBar";
import { TaskListView } from "@/components/recorrida/TaskListView";
import { AddTaskSheet } from "@/components/recorrida/AddTaskSheet";
import { randomUUID as uuid } from "expo-crypto";
import { getTareaTipos, getTareaTipo, type TareaTipoConfig } from "@/constants/tareas";
import { brand, neutral, gis, components } from "@/constants/theme";

// ── Types ──

interface Recorrida {
  id: string;
  id_establecimiento: string;
  nombre: string | null;
  fecha: string;
  estado: string;
}

interface Lote {
  id: string;
  nombre_lote: string;
  has: number | null;
  geometry: string;
}

interface Ambiente {
  id: string;
  lote_id: string | null;
  nombre: string;
  geometry: string;
  has: number;
  color: string | null;
}

interface AmbienteLote {
  id: string;
  lote_id: string;
  ambiente_id: string;
  nombre_ambiente: string;
  nombre_lote: string;
  geometry: string;
  has: number;
  porcentaje_lote: number;
  color: string | null;
}

interface CapaGis {
  id: string;
  tipo: string;
  geojson: string;
}

type Tab = "tareas" | "mapa";

export default function RecorridaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const [tab, setTab] = useState<Tab>("tareas");
  const [recorrida, setRecorrida] = useState<Recorrida | null>(null);
  const [tareas, setTareas] = useState<any[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [ambienteLotes, setAmbienteLotes] = useState<AmbienteLote[]>([]);
  const [perimetroPolygons, setPerimetroPolygons] = useState<{ latitude: number; longitude: number }[][]>([]);
  const [tareaTipos, setTareaTipos] = useState<TareaTipoConfig[]>([]);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const { location } = useLocation();

  const [layers, setLayers] = useState<LayerVisibility>({
    perimetro: false,
    lotes: true,
    ambientes: false,
    ambienteLotes: false,
  });

  const loadData = useCallback(async () => {
    const rec = await getOne<Recorrida>("dc_recorrida", id);
    if (!rec) return;
    setRecorrida(rec);

    const estabId = rec.id_establecimiento;

    const [lots, ambs, ambLots, capas, tareasData, tipos] = await Promise.all([
      getAll<Lote>("dc_lote", "id_establecimiento = ? AND estado = 'activo'", [estabId]),
      getAll<Ambiente>("dc_ambiente", "id_establecimiento = ? AND estado = 'activo'", [estabId]),
      getAll<AmbienteLote>("dc_ambiente_lote", "id_establecimiento = ?", [estabId]),
      getAll<CapaGis>("dc_capa_gis", "id_establecimiento = ? AND tipo = ?", [estabId, "perimetro"]),
      getTareasParaRecorrida(id),
      getTareaTipos(),
    ]);

    setLotes(lots);
    setAmbientes(ambs);
    setAmbienteLotes(ambLots);
    setTareas(tareasData);
    setTareaTipos(tipos);

    if (capas.length > 0) {
      const polys = capas.flatMap((c) => parseFeatureCollection(c.geojson));
      setPerimetroPolygons(polys);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recargar al volver de tarea/[id]
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ── Derived data ──

  const completadas = tareas.filter((t) => t.estado === "completa").length;

  const lotesMap = new Map(lotes.map((l) => [l.id, { id: l.id, nombre_lote: l.nombre_lote, has: l.has }]));
  const ambientesMap = new Map(ambientes.map((a) => [a.id, { id: a.id, nombre: a.nombre, has: a.has }]));

  // ── Handlers ──

  const handleAddTarea = async (tipoId: string, loteId: string | null, ambienteId: string | null) => {
    if (!recorrida) return;
    const tipoConfig = await getTareaTipo(tipoId);
    await insert("dc_tarea", {
      id: uuid(),
      recorrida_id: id,
      tarea_tipo_id: tipoId,
      lote_id: loteId,
      ambiente_id: ambienteId,
      estado: "sin_iniciar",
      datos: "{}",
      origen: "campo",
      id_establecimiento: recorrida.id_establecimiento,
      form_version: tipoConfig?.version ?? 1,
      orden: tareas.length,
    });
    await loadData();
  };

  const finalizarRecorrida = async () => {
    const sinCompletar = tareas.filter((t) => t.estado !== "completa").length;
    const msg = sinCompletar > 0
      ? `Hay ${sinCompletar} tarea${sinCompletar !== 1 ? "s" : ""} sin completar. ¿Finalizar igual?`
      : "¿Finalizar la recorrida?";

    Alert.alert("Finalizar recorrida", msg, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Finalizar",
        onPress: async () => {
          await update("dc_recorrida", id, { estado: "completa" });
          router.back();
        },
      },
    ]);
  };

  const toggleLayer = (layer: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // ── Map region ──

  const allCoords = lotes.flatMap((l) => parseGeometry(l.geometry));
  const center = allCoords.length > 0 ? getCentroid(allCoords) : { latitude: -34, longitude: -64 };

  const hasAmbienteLotes = ambienteLotes.length > 0;

  // Tareas completadas por lote (para mapa)
  const tareasCompletasPorLote = new Set(
    tareas.filter((t) => t.estado === "completa").map((t) => t.lote_id).filter(Boolean)
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: recorrida?.nombre ?? `Recorrida ${recorrida?.fecha ?? ""}` }}
      />

      {/* Header con progreso */}
      <View style={styles.header}>
        <ProgressBar completed={completadas} total={tareas.length} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "tareas" && styles.tabBtnActive]}
          onPress={() => setTab("tareas")}
        >
          <Text style={[styles.tabText, tab === "tareas" && styles.tabTextActive]}>
            Tareas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "mapa" && styles.tabBtnActive]}
          onPress={() => setTab("mapa")}
        >
          <Text style={[styles.tabText, tab === "mapa" && styles.tabTextActive]}>
            Mapa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      {tab === "tareas" ? (
        <View style={{ flex: 1 }}>
          {/* Botón agregar */}
          <View style={styles.addRow}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddSheet(true)}
            >
              <Text style={styles.addBtnText}>+ Agregar Tarea</Text>
            </TouchableOpacity>
          </View>

          <TaskListView
            tareas={tareas}
            tareaTipos={tareaTipos}
            lotes={lotesMap}
            ambientes={ambientesMap}
          />

          {/* Finalizar */}
          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.finishBtn} onPress={finalizarRecorrida}>
              <Text style={styles.finishBtnText}>Finalizar Recorrida</Text>
            </TouchableOpacity>
          </View>

          <AddTaskSheet
            visible={showAddSheet}
            onClose={() => setShowAddSheet(false)}
            onAdd={handleAddTarea}
            tareaTipos={tareaTipos}
            lotes={lotes.map((l) => ({ id: l.id, nombre_lote: l.nombre_lote, has: l.has }))}
            ambientes={ambientes.map((a) => ({
              id: a.id,
              nombre: a.nombre,
              has: a.has,
              lote_id: a.lote_id ?? "",
            }))}
          />
        </View>
      ) : (
        /* Tab Mapa */
        <View style={styles.mapContainer}>
          {process.env.EXPO_OS === "web" || !MapView ? (
            <View style={[styles.map, { justifyContent: "center", alignItems: "center", backgroundColor: "#222" }]}>
              <Text style={{ color: brand.white, fontSize: 16 }}>Mapa no disponible en web</Text>
            </View>
          ) : (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              mapType="satellite"
              initialRegion={{
                ...center,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              {/* Perímetro */}
              {layers.perimetro &&
                perimetroPolygons.map((coords, i) => (
                  <Polygon
                    key={`perim-${i}`}
                    coordinates={coords}
                    strokeColor={gis.perimeter}
                    fillColor="transparent"
                    strokeWidth={1.5}
                    lineDashPattern={[8, 4]}
                  />
                ))}

              {/* Lotes */}
              {layers.lotes &&
                lotes.map((lote, i) => {
                  const coords = parseGeometry(lote.geometry);
                  if (coords.length === 0) return null;
                  const measured = tareasCompletasPorLote.has(lote.id);
                  const centroid = getCentroid(coords);

                  return (
                    <View key={`lote-${lote.id}`}>
                      <Polygon
                        coordinates={coords}
                        strokeColor={measured ? gis.measuredStroke : brand.white}
                        fillColor={measured ? gis.measuredFill : gis.loteColors[i % gis.loteColors.length]}
                        strokeWidth={2}
                        tappable
                        onPress={() => {
                          // Buscar primera tarea de este lote
                          const t = tareas.find((t) => t.lote_id === lote.id);
                          if (t) router.push(`/(app)/navegacion/${t.id}`);
                        }}
                      />
                      <Marker
                        coordinate={centroid}
                        anchor={{ x: 0.5, y: 0.5 }}
                        tracksViewChanges={false}
                      >
                        <View style={[styles.loteLabel, measured && styles.loteLabelMeasured]}>
                          <Text style={styles.loteLabelText}>{lote.nombre_lote}</Text>
                        </View>
                      </Marker>
                    </View>
                  );
                })}

              {/* Ambientes */}
              {layers.ambientes &&
                ambientes.map((amb, i) => {
                  const polygons = parseGeometryMulti(amb.geometry);
                  if (polygons.length === 0) return null;
                  const color = amb.color ?? gis.ambienteColors[i % gis.ambienteColors.length];
                  return polygons.map((coords, pi) => (
                    <Polygon
                      key={`amb-${amb.id}-${pi}`}
                      coordinates={coords}
                      strokeColor={color}
                      fillColor={color + "4D"}
                      strokeWidth={1.5}
                    />
                  ));
                })}

              {/* Lote x Ambiente */}
              {layers.ambienteLotes &&
                ambienteLotes.map((al) => {
                  const polygons = parseGeometryMulti(al.geometry);
                  if (polygons.length === 0) return null;
                  const allCoords = polygons.flat();
                  const centroid = getCentroid(allCoords);
                  const color = al.color ?? gis.ambienteTeal;

                  return (
                    <View key={`al-${al.id}`}>
                      {polygons.map((coords, pi) => (
                        <Polygon
                          key={`al-${al.id}-${pi}`}
                          coordinates={coords}
                          strokeColor={color}
                          fillColor={color + "66"}
                          strokeWidth={1.5}
                          tappable
                          onPress={() => {
                            const t = tareas.find(
                              (t) => t.lote_id === al.lote_id && t.ambiente_id === al.ambiente_id
                            );
                            if (t) router.push(`/(app)/navegacion/${t.id}`);
                          }}
                        />
                      ))}
                      <Marker
                        coordinate={centroid}
                        anchor={{ x: 0.5, y: 0.5 }}
                        tracksViewChanges={false}
                      >
                        <View style={styles.alLabel}>
                          <Text style={styles.alLabelText}>
                            {al.nombre_lote}/{al.nombre_ambiente}
                          </Text>
                        </View>
                      </Marker>
                    </View>
                  );
                })}
            </MapView>
          )}

          {location && (
            <TouchableOpacity
              style={styles.myLocationBtn}
              onPress={() => {
                mapRef.current?.animateToRegion(
                  {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                  500
                );
              }}
            >
              <Text style={styles.myLocationIcon}>📍</Text>
            </TouchableOpacity>
          )}

          <LayerToggle
            layers={layers}
            onToggle={toggleLayer}
            hasAmbienteLotes={hasAmbienteLotes}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background },

  // Header
  header: {
    backgroundColor: neutral.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: neutral.borderSubtle,
  },

  // Tabs
  tabBar: {
    flexDirection: "row",
    backgroundColor: neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: neutral.borderSubtle,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: brand.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: neutral.textMuted,
  },
  tabTextActive: {
    color: brand.primary,
  },

  // Tareas tab
  addRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "flex-end",
  },
  addBtn: {
    backgroundColor: brand.primary,
    borderRadius: 6,
    borderCurve: "continuous",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addBtnText: { color: brand.white, fontWeight: "600", fontSize: 13 },

  footerActions: {
    padding: 16,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.borderSubtle,
  },
  finishBtn: {
    backgroundColor: components.buttonDanger.background,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 14,
    alignItems: "center",
  },
  finishBtnText: {
    color: components.buttonDanger.text,
    fontWeight: "700",
    fontSize: 15,
  },

  // Map tab
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  loteLabel: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  loteLabelMeasured: { backgroundColor: "rgba(76,175,80,0.8)" },
  loteLabelText: { color: brand.white, fontSize: 11, fontWeight: "600" },
  alLabel: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  alLabelText: { color: brand.white, fontSize: 9, fontWeight: "500" },
  myLocationBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
  },
  myLocationIcon: { fontSize: 20 },
});
