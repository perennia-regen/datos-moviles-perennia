import { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getOne, getAll } from "../../../db/operations";
import {
  MapView,
  Marker,
  Polyline,
  Polygon,
  PROVIDER_DEFAULT,
} from "../../../components/map/MapComponents";
import { useLocation } from "../../../hooks/useLocation";
import { useHeading } from "../../../hooks/useHeading";
import {
  parseGeometry,
  parseGeometryMulti,
  getCentroid,
  haversineDistance,
  bearingTo,
  formatDistance,
  bearingToCardinal,
} from "../../../lib/geo";
import { brand, neutral, gis } from "../../../constants/theme";

// ── Types ──

interface TareaNav {
  id: string;
  tarea_tipo_id: string;
  lote_id: string | null;
  ambiente_id: string | null;
  id_establecimiento: string;
  gps_objetivo_lat: number | null;
  gps_objetivo_lng: number | null;
}

interface LoteNav {
  id: string;
  nombre_lote: string;
  geometry: string;
  color: string | null;
}

interface AmbienteLoteNav {
  id: string;
  lote_id: string;
  ambiente_id: string;
  nombre_lote: string;
  nombre_ambiente: string;
  geometry: string;
  color: string | null;
}

// ── Screen ──

export default function NavegacionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const { location } = useLocation();
  const compassHeading = useHeading();

  const [tarea, setTarea] = useState<TareaNav | null>(null);
  const [destino, setDestino] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destinoNombre, setDestinoNombre] = useState("");
  const [polygons, setPolygons] = useState<
    { latitude: number; longitude: number }[][]
  >([]);
  const [polygonColor, setPolygonColor] = useState<string>(brand.primary);

  // Cargar tarea y calcular destino
  useEffect(() => {
    (async () => {
      const t = await getOne<TareaNav>("dc_tarea", id);
      if (!t) return;
      setTarea(t);

      // 1. Punto objetivo explícito
      if (
        t.gps_objetivo_lat != null &&
        t.gps_objetivo_lng != null
      ) {
        setDestino({
          latitude: t.gps_objetivo_lat,
          longitude: t.gps_objetivo_lng,
        });

        // Cargar polígono de contexto igualmente
        if (t.lote_id) {
          const lote = await getOne<LoteNav>("dc_lote", t.lote_id);
          if (lote) {
            setDestinoNombre(lote.nombre_lote);
            setPolygons([parseGeometry(lote.geometry)]);
            setPolygonColor(lote.color ?? brand.primary);
          }
        }
        return;
      }

      // 2. Centroide de ambiente_lote
      if (t.ambiente_id && t.lote_id) {
        const ambLotes = await getAll<AmbienteLoteNav>(
          "dc_ambiente_lote",
          "lote_id = ? AND ambiente_id = ?",
          [t.lote_id, t.ambiente_id]
        );
        if (ambLotes.length > 0) {
          const al = ambLotes[0];
          const polys = parseGeometryMulti(al.geometry);
          if (polys.length > 0) {
            setPolygons(polys);
            setPolygonColor(al.color ?? gis.ambienteTeal);
            setDestino(getCentroid(polys.flat()));
            setDestinoNombre(`${al.nombre_lote} / ${al.nombre_ambiente}`);
            return;
          }
        }
      }

      // 3. Centroide de lote
      if (t.lote_id) {
        const lote = await getOne<LoteNav>("dc_lote", t.lote_id);
        if (lote) {
          const coords = parseGeometry(lote.geometry);
          if (coords.length > 0) {
            setPolygons([coords]);
            setPolygonColor(lote.color ?? brand.primary);
            setDestino(getCentroid(coords));
            setDestinoNombre(lote.nombre_lote);
          }
        }
      }
    })();
  }, [id]);

  // Cálculos de navegación
  const distance = useMemo(
    () =>
      location && destino ? haversineDistance(location, destino) : null,
    [location, destino]
  );
  const bearing = useMemo(
    () => (location && destino ? bearingTo(location, destino) : null),
    [location, destino]
  );

  // Ángulo relativo: hacia dónde girar respecto a donde estoy mirando
  const arrowRotation = useMemo(() => {
    if (compassHeading == null || bearing == null) return null;
    return bearing - compassHeading;
  }, [compassHeading, bearing]);

  // Región inicial del mapa
  const initialRegion = useMemo(() => {
    const center = destino ?? { latitude: -30, longitude: -60 };
    return {
      ...center,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [destino]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Mapa fullscreen */}
      {MapView && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          mapType="satellite"
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* Polígono de contexto */}
          {polygons.map((coords, i) => (
            <Polygon
              key={`poly-${i}`}
              coordinates={coords}
              strokeColor={polygonColor}
              fillColor={polygonColor + "30"}
              strokeWidth={2}
            />
          ))}

          {/* Línea punteada posición → destino */}
          {location && destino && Polyline && (
            <Polyline
              coordinates={[
                { latitude: location.latitude, longitude: location.longitude },
                destino,
              ]}
              strokeColor="#FFFFFF"
              strokeWidth={2}
              lineDashPattern={[8, 6]}
            />
          )}

          {/* Marker destino */}
          {destino && (
            <Marker coordinate={destino} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.destinoMarker}>
                <View style={styles.destinoMarkerInner} />
              </View>
            </Marker>
          )}
        </MapView>
      )}

      {/* Header overlay */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {destinoNombre || "Navegación"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Panel inferior */}
      <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
        {/* Métricas */}
        <View style={styles.metricsRow}>
          <MetricBox
            label="DISTANCIA"
            value={distance != null ? formatDistance(distance) : "---"}
          />
          <MetricBox
            label="RUMBO"
            value={
              compassHeading != null
                ? `${Math.round(compassHeading)}° ${bearingToCardinal(compassHeading)}`
                : "---"
            }
          />
          <MetricBox
            label="DESTINO"
            value={
              bearing != null
                ? `${Math.round(((bearing % 360) + 360) % 360)}° ${bearingToCardinal(bearing)}`
                : "---"
            }
          />
        </View>

        {/* Flecha de dirección */}
        <View style={styles.arrowContainer}>
          {arrowRotation != null ? (
            <Text
              style={[
                styles.arrow,
                { transform: [{ rotate: `${arrowRotation}deg` }] },
              ]}
            >
              ↑
            </Text>
          ) : (
            <Text style={styles.arrowWaiting}>Obteniendo ubicación...</Text>
          )}
        </View>

        {/* Nombre destino */}
        {destinoNombre !== "" && (
          <Text style={styles.destinoLabel}>{destinoNombre}</Text>
        )}

        {/* Botón completar tarea */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.replace(`/(app)/tarea/${id}`)}
        >
          <Text style={styles.ctaText}>Completar Tarea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Metric Box ──

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 36,
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // Panel inferior
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  metricBox: {
    alignItems: "center",
    minWidth: 80,
  },
  metricValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Flecha
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 8,
  },
  arrow: {
    color: brand.accent,
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 52,
  },
  arrowWaiting: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },

  // Destino
  destinoLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },

  // CTA
  ctaBtn: {
    backgroundColor: brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 4,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Marker destino
  destinoMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  destinoMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF4444",
    borderWidth: 2,
    borderColor: "#fff",
  },
});
