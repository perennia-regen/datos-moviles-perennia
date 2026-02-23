import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { datosCampo } from "../../../lib/supabase";
import { getAll, downloadEstablecimientoData } from "../../../db/operations";
import { getDb } from "../../../db/schema";
import { useEducador } from "../../../hooks/useEducador";
import { randomUUID as uuid } from "expo-crypto";
import { insert, crearTareasParaRecorrida } from "../../../db/operations";
import { generarNombreRecorrida } from "../../../constants/tareas";
import { MapView, Polygon, PROVIDER_DEFAULT } from "../../../components/map/MapComponents";
import { parseGeometry, getCentroid } from "../../../lib/geo";
import { useOfflineSync } from "../../../hooks/useOfflineSync";
import { brand, neutral, semantic, gis, components } from "../../../constants/theme";

interface Servicio {
  id_servicio: string;
  id_establecimiento: string;
  nombre_establecimiento: string;
  servicio: string;
  fecha: string | null;
  fecha_fin: string | null;
  estado_trabajo: number;
  downloaded_at: string | null;
}

interface Lote {
  id: string;
  nombre_lote: string;
  has: number | null;
  geometry: string;
}

interface Recorrida {
  id: string;
  nombre: string | null;
  fecha: string;
  estado: string;
  observaciones_generales: string | null;
}

const ESTADO_LABELS: Record<number, string> = {
  3: "Agendado",
  4: "Por rendir",
};

export default function ServicioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { educadorId } = useEducador();
  const { isConnected } = useOfflineSync();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [recorridas, setRecorridas] = useState<Recorrida[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Leer servicio de SQLite
      const db = await getDb();
      const srv = await db.getFirstAsync<Servicio>(
        "SELECT * FROM dc_servicio WHERE id_servicio = ?",
        [id]
      );
      setServicio(srv);

      if (srv) {
        // Lotes descargados del establecimiento
        const localLotes = await getAll<Lote>(
          "dc_lote",
          "id_establecimiento = ?",
          [srv.id_establecimiento]
        );
        setLotes(localLotes);

        // Recorridas de este servicio (solo las mías)
        const where = educadorId
          ? "id_servicio = ? AND educador_id = ? ORDER BY fecha DESC"
          : "id_servicio = ? ORDER BY fecha DESC";
        const params = educadorId ? [id, educadorId] : [id];
        const localRecorridas = await getAll<Recorrida>("dc_recorrida", where, params);
        setRecorridas(localRecorridas);
      }
    } catch (e: any) {
      console.error("Error loading servicio:", e);
    } finally {
      setLoading(false);
    }
  }, [id, educadorId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDownload = async () => {
    if (!servicio) return;
    setDownloading(true);
    try {
      const result = await downloadEstablecimientoData(
        servicio.id_establecimiento,
        datosCampo
      );

      // Marcar downloaded_at en dc_servicio
      const db = await getDb();
      await db.runAsync(
        "UPDATE dc_servicio SET downloaded_at = ? WHERE id_servicio = ?",
        [new Date().toISOString(), id]
      );

      await loadData();

      if (result.lotes === 0) {
        Alert.alert(
          "Sin datos",
          "Este establecimiento no tiene lotes cargados en el sistema. Contactá al administrador."
        );
      } else {
        Alert.alert(
          "Listo",
          `${result.lotes} lotes, ${result.ambientes} ambientes, ${result.ambienteLotes} intersecciones descargados`
        );
      }
    } catch (e: any) {
      console.error("Download error:", e);
      Alert.alert("Error", "No se pudieron descargar los datos: " + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleCrearRecorrida = async () => {
    if (!servicio || !educadorId) return;

    const hoy = new Date().toISOString().split("T")[0];
    const recorridaId = uuid();
    const nombre = generarNombreRecorrida(
      servicio.nombre_establecimiento,
      servicio.servicio
    );

    // Registrar capa_gis_id para historial
    const capaGisId = lotes.length > 0 ? (lotes[0] as any).capa_gis_id ?? null : null;

    await insert("dc_recorrida", {
      id: recorridaId,
      id_establecimiento: servicio.id_establecimiento,
      id_servicio: servicio.id_servicio,
      educador_id: educadorId,
      capa_gis_id: capaGisId,
      nombre,
      fecha: hoy,
      estado: "en_curso",
    });

    // Auto-generar tareas según tipos asignados al servicio
    const numTareas = await crearTareasParaRecorrida(
      recorridaId,
      servicio.id_establecimiento,
      servicio.servicio
    );

    await loadData();
    router.push(`/(app)/recorrida/${recorridaId}`);
  };

  // ── Map data ──
  const allCoords = lotes.flatMap((l) => parseGeometry(l.geometry));
  const center = allCoords.length > 0 ? getCentroid(allCoords) : null;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  if (!servicio) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Servicio no encontrado</Text>
      </View>
    );
  }

  const hasLotes = lotes.length > 0;
  const downloadBtnText = hasLotes ? "Actualizar Lotes" : "Descargar Lotes";
  const canDownload = isConnected && !downloading;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: servicio.nombre_establecimiento || "Servicio" }}
      />

      <FlatList
        data={recorridas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{servicio.nombre_establecimiento}</Text>
              <Text style={styles.headerService}>{servicio.servicio}</Text>
              <View style={styles.headerMeta}>
                {servicio.fecha && (
                  <Text style={styles.headerDate}>{servicio.fecha}</Text>
                )}
                <View
                  style={[
                    styles.badge,
                    servicio.estado_trabajo === 4 && styles.badgeWarning,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      servicio.estado_trabajo === 4 && styles.badgeTextWarning,
                    ]}
                  >
                    {ESTADO_LABELS[servicio.estado_trabajo] ?? `Estado ${servicio.estado_trabajo}`}
                  </Text>
                </View>
              </View>
              <Text style={styles.headerSub}>
                {hasLotes
                  ? `${lotes.length} lotes descargados`
                  : "Sin lotes descargados"}
              </Text>
            </View>

            {/* Mini-mapa */}
            {hasLotes && center && Platform.OS !== "web" && MapView ? (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  provider={PROVIDER_DEFAULT}
                  mapType="satellite"
                  initialRegion={{
                    ...center,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  toolbarEnabled={false}
                  showsUserLocation={false}
                  liteMode={Platform.OS === "android"}
                >
                  {lotes.map((lote, i) => {
                    const coords = parseGeometry(lote.geometry);
                    if (coords.length === 0) return null;
                    return (
                      <Polygon
                        key={lote.id}
                        coordinates={coords}
                        strokeColor={gis.perimeter}
                        fillColor={gis.loteColors[i % gis.loteColors.length]}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </MapView>
                <View style={styles.mapOverlayLabel}>
                  <Text style={styles.mapOverlayText}>
                    {lotes.length} lote{lotes.length !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
            ) : !hasLotes ? (
              <View style={styles.noMapPlaceholder}>
                <Text style={styles.noMapIcon}>🗺️</Text>
                <Text style={styles.noMapText}>
                  Descargá los lotes para ver el mapa
                </Text>
              </View>
            ) : null}

            {/* Acciones */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, !canDownload && styles.actionBtnDisabled]}
                onPress={handleDownload}
                disabled={!canDownload}
              >
                {downloading ? (
                  <ActivityIndicator color={brand.white} size="small" />
                ) : (
                  <Text style={styles.actionBtnText}>
                    {!isConnected ? "Sin conexión" : downloadBtnText}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.actionBtnPrimary,
                  (!hasLotes || !educadorId) && styles.actionBtnDisabled,
                ]}
                onPress={handleCrearRecorrida}
                disabled={!hasLotes || !educadorId}
              >
                <Text style={styles.actionBtnText}>Crear Recorrida</Text>
              </TouchableOpacity>
            </View>

            {/* Título recorridas */}
            <Text style={styles.sectionTitle}>Mis recorridas</Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sin recorridas aún</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recorridaCard}
            onPress={() => router.push(`/(app)/recorrida/${item.id}`)}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.recorridaDate}>
                {item.nombre ?? item.fecha}
              </Text>
              {item.nombre && (
                <Text style={styles.recorridaObs}>{item.fecha}</Text>
              )}
            </View>
            <View
              style={[
                styles.stateBadge,
                item.estado === "completa" && styles.stateBadgeComplete,
              ]}
            >
              <Text style={styles.stateText}>
                {item.estado === "en_curso" ? "En curso" : "Completa"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral.background,
  },
  listContent: { paddingBottom: 32 },
  header: {
    padding: 16,
    backgroundColor: neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: neutral.borderSubtle,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: brand.text },
  headerService: { fontSize: 15, color: neutral.textSecondary, marginTop: 2 },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  headerDate: { fontSize: 14, color: neutral.textSecondary },
  headerSub: { fontSize: 14, color: neutral.textMuted, marginTop: 6 },
  badge: {
    backgroundColor: components.badge.background,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: components.badge.text },
  badgeWarning: { backgroundColor: components.badgeWarning.background },
  badgeTextWarning: { color: components.badgeWarning.text },

  // Mini-mapa
  mapContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: { flex: 1 },
  mapOverlayLabel: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mapOverlayText: { color: brand.white, fontSize: 11, fontWeight: "600" },
  noMapPlaceholder: {
    height: 120,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#e8e8e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: neutral.border,
    borderStyle: "dashed",
  },
  noMapIcon: { fontSize: 28, marginBottom: 6 },
  noMapText: { fontSize: 13, color: neutral.textMuted },

  // Acciones
  actions: { flexDirection: "row", paddingHorizontal: 16, gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: components.buttonSecondary.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnPrimary: { backgroundColor: components.buttonPrimary.background },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { color: brand.white, fontWeight: "600", fontSize: 14 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: brand.text,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { textAlign: "center", color: neutral.textPlaceholder, marginTop: 20 },
  recorridaCard: {
    backgroundColor: neutral.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recorridaDate: { fontSize: 15, fontWeight: "600", color: brand.text },
  recorridaObs: { fontSize: 13, color: neutral.textMuted, marginTop: 2 },
  stateBadge: {
    backgroundColor: semantic.warningSubtle,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stateBadgeComplete: { backgroundColor: semantic.successSubtle },
  stateText: { fontSize: 12, fontWeight: "500", color: neutral.textSecondary },
});
