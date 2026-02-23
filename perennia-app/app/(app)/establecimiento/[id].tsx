import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { datosCampo, supabase } from "../../../lib/supabase";
import { getAll, insert, downloadEstablecimientoData } from "../../../db/operations";
import { randomUUID as uuid } from "expo-crypto";
import { brand, neutral, semantic, components } from "../../../constants/theme";

interface Lote {
  id: string;
  nombre_lote: string;
  has: number | null;
  geometry: string;
}

interface Recorrida {
  id: string;
  fecha: string;
  estado: string;
  observaciones_generales: string | null;
}

export default function EstablecimientoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [recorridas, setRecorridas] = useState<Recorrida[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Nombre del establecimiento
      const { data: estab } = await supabase
        .from("establecimientos")
        .select("nombre_establecimiento")
        .eq("id_establecimiento", id)
        .single();
      if (estab) setNombre(estab.nombre_establecimiento);

      // Lotes desde SQLite local
      const localLotes = await getAll<Lote>("dc_lote", "id_establecimiento = ?", [id]);
      setLotes(localLotes);

      // Recorridas desde SQLite local
      const localRecorridas = await getAll<Recorrida>(
        "dc_recorrida",
        "id_establecimiento = ? ORDER BY fecha DESC",
        [id]
      );
      setRecorridas(localRecorridas);
    } catch (e: any) {
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const downloadData = async () => {
    setDownloading(true);
    try {
      const result = await downloadEstablecimientoData(id, datosCampo);
      await loadData();
      Alert.alert("Listo", `${result.lotes} lotes, ${result.ambientes} ambientes, ${result.ambienteLotes} intersecciones descargados`);
    } catch (e: any) {
      console.error("Download error:", e);
      Alert.alert("Error", "No se pudieron descargar los datos: " + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const createRecorrida = async () => {
    const hoy = new Date().toISOString().split("T")[0];
    const recorridaId = uuid();

    await insert("dc_recorrida", {
      id: recorridaId,
      id_establecimiento: id,
      fecha: hoy,
      estado: "en_curso",
    });

    router.push(`/(app)/recorrida/${recorridaId}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre || "Establecimiento" }} />

      {/* Info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{nombre}</Text>
        <Text style={styles.headerSub}>{lotes.length} lotes cargados</Text>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={downloadData} disabled={downloading}>
          {downloading ? (
            <ActivityIndicator color={brand.white} size="small" />
          ) : (
            <Text style={styles.actionBtnText}>Descargar Lotes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnPrimary]}
          onPress={createRecorrida}
          disabled={lotes.length === 0}
        >
          <Text style={styles.actionBtnText}>Nueva Recorrida</Text>
        </TouchableOpacity>
      </View>

      {/* Recorridas anteriores */}
      <Text style={styles.sectionTitle}>Recorridas</Text>
      <FlatList
        data={recorridas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sin recorridas aún</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recorridaCard}
            onPress={() => router.push(`/(app)/recorrida/${item.id}`)}
          >
            <View>
              <Text style={styles.recorridaDate}>{item.fecha}</Text>
              {item.observaciones_generales && (
                <Text style={styles.recorridaObs} numberOfLines={1}>
                  {item.observaciones_generales}
                </Text>
              )}
            </View>
            <View style={[styles.stateBadge, item.estado === "completa" && styles.stateBadgeComplete]}>
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: neutral.background },
  header: { padding: 16, backgroundColor: neutral.surface, borderBottomWidth: 1, borderBottomColor: neutral.borderSubtle },
  headerTitle: { fontSize: 20, fontWeight: "700", color: brand.text },
  headerSub: { fontSize: 14, color: neutral.textMuted, marginTop: 2 },
  actions: { flexDirection: "row", padding: 16, gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: components.buttonSecondary.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnPrimary: { backgroundColor: components.buttonPrimary.background },
  actionBtnText: { color: brand.white, fontWeight: "600", fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: brand.text, paddingHorizontal: 16, marginTop: 8 },
  listContent: { padding: 16 },
  emptyText: { textAlign: "center", color: neutral.textPlaceholder, marginTop: 20 },
  recorridaCard: {
    backgroundColor: neutral.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
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
