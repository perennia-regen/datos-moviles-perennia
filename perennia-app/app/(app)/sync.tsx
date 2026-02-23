import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { getDeadItems, retryDeadItems, discardDeadItems } from "@/db/operations";
import { supabase } from "@/lib/supabase";
import { SyncResult } from "@/db/sync";
import { resetDb } from "@/db/schema";
import { brand, neutral, semantic, components } from "@/constants/theme";

export default function SyncScreen() {
  const { pendingCount, pendingByEstab, isSyncing, isConnected, doSync, refreshCount } =
    useOfflineSync();
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [deadCount, setDeadCount] = useState(0);
  const [syncingEstab, setSyncingEstab] = useState<string | null>(null);
  const [estabNames, setEstabNames] = useState<Record<string, string>>({});

  // Cargar nombres de establecimientos y dead items
  const loadExtra = useCallback(async () => {
    const dead = (await getDeadItems()) as any[];
    setDeadCount(dead.length);

    // Resolver nombres
    const ids = pendingByEstab.map((e) => e.id_establecimiento).filter(Boolean);
    if (ids.length > 0) {
      const { data } = await supabase
        .from("establecimientos")
        .select("id_establecimiento, nombre_establecimiento")
        .in("id_establecimiento", ids);
      if (data) {
        const names: Record<string, string> = {};
        data.forEach((e: any) => {
          names[e.id_establecimiento] = e.nombre_establecimiento;
        });
        setEstabNames(names);
      }
    }
  }, [pendingByEstab]);

  useEffect(() => {
    loadExtra();
  }, [loadExtra]);

  const handleSyncEstab = async (idEstablecimiento: string) => {
    if (!isConnected) {
      Alert.alert("Sin conexion", "Necesitas conexion a internet para sincronizar");
      return;
    }
    setSyncingEstab(idEstablecimiento);
    const result = await doSync(idEstablecimiento);
    setSyncingEstab(null);
    if (result) {
      setLastResult(result);
      if (result.authError) {
        Alert.alert(
          "Sesion expirada",
          "Tu sesion expiro. Inicia sesion de nuevo para sincronizar.",
          [{ text: "OK" }]
        );
      }
    }
    await loadExtra();
  };

  const handleSyncAll = async () => {
    if (!isConnected) {
      Alert.alert("Sin conexion", "Necesitas conexion a internet para sincronizar");
      return;
    }
    const result = await doSync();
    if (result) {
      setLastResult(result);
      if (result.authError) {
        Alert.alert(
          "Sesion expirada",
          "Tu sesion expiro. Inicia sesion de nuevo para sincronizar.",
          [{ text: "OK" }]
        );
      }
    }
    await loadExtra();
  };

  const handleRetryDead = async () => {
    await retryDeadItems();
    await refreshCount();
    await loadExtra();
  };

  const handleDiscardDead = () => {
    Alert.alert(
      "Descartar datos",
      "Estos datos no se pudieron sincronizar despues de 5 intentos. Si los descartas, se perderan. Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: async () => {
            await discardDeadItems();
            await refreshCount();
            await loadExtra();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      {/* Estado general */}
      <View style={styles.card}>
        <Text style={styles.title}>Estado de Sincronizacion</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Conexion</Text>
          <View style={styles.valueRow}>
            <View
              style={[styles.dot, { backgroundColor: isConnected ? semantic.success : semantic.destructive }]}
            />
            <Text style={styles.value}>{isConnected ? "Online" : "Offline"}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pendientes</Text>
          <Text style={[styles.value, pendingCount > 0 && styles.valuePending]}>
            {pendingCount}
          </Text>
        </View>

        {lastResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Sincronizados: {lastResult.synced} | Fallidos: {lastResult.failed}
            </Text>
          </View>
        )}
      </View>

      {/* Pendientes por establecimiento */}
      {pendingByEstab.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Por establecimiento</Text>
          {pendingByEstab.map((item) => (
            <View key={item.id_establecimiento} style={styles.estabRow}>
              <View style={styles.estabInfo}>
                <Text style={styles.estabName} numberOfLines={1}>
                  {estabNames[item.id_establecimiento] ?? item.id_establecimiento.slice(0, 8)}
                </Text>
                <Text style={styles.estabCount}>{item.count} items</Text>
              </View>
              <TouchableOpacity
                style={[styles.estabBtn, syncingEstab === item.id_establecimiento && styles.estabBtnDisabled]}
                onPress={() => handleSyncEstab(item.id_establecimiento)}
                disabled={isSyncing || !isConnected}
              >
                {syncingEstab === item.id_establecimiento ? (
                  <ActivityIndicator size="small" color={brand.white} />
                ) : (
                  <Text style={styles.estabBtnText}>Subir</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Dead letter */}
      {deadCount > 0 && (
        <View style={[styles.card, styles.cardDead]}>
          <Text style={styles.subtitle}>Items con error permanente</Text>
          <Text style={styles.deadText}>
            {deadCount} item{deadCount > 1 ? "s" : ""} no se pudieron sincronizar despues de 5
            intentos.
          </Text>
          <View style={styles.deadActions}>
            <TouchableOpacity style={styles.deadBtn} onPress={handleRetryDead}>
              <Text style={styles.deadBtnText}>Reintentar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deadBtn, styles.deadBtnDanger]}
              onPress={handleDiscardDead}
            >
              <Text style={[styles.deadBtnText, styles.deadBtnDangerText]}>Descartar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón principal */}
      <TouchableOpacity
        style={[styles.syncBtn, (isSyncing || pendingCount === 0) && styles.syncBtnDisabled]}
        onPress={handleSyncAll}
        disabled={isSyncing || pendingCount === 0}
      >
        <Text style={styles.syncBtnText}>
          {isSyncing
            ? "Sincronizando..."
            : pendingCount === 0
              ? "Todo sincronizado"
              : "Subir Todo"}
        </Text>
      </TouchableOpacity>

      {/* Dev: Reset DB */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() =>
            Alert.alert(
              "Reset DB local",
              "Se borrarán todos los datos locales (lotes, recorridas, tareas, cola de sync). ¿Continuar?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Borrar todo",
                  style: "destructive",
                  onPress: async () => {
                    await resetDb();
                    Alert.alert("Listo", "DB borrada. Reiniciá la app para recrear el schema.");
                  },
                },
              ]
            )
          }
        >
          <Text style={styles.resetBtnText}>Reset DB local (dev)</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background, padding: 16 },
  card: {
    backgroundColor: neutral.surface,
    borderRadius: components.card.radius,
    borderCurve: "continuous",
    padding: 16,
    marginBottom: 16,
  },
  cardDead: {
    borderWidth: 1,
    borderColor: semantic.destructiveBorder,
  },
  title: { fontSize: 18, fontWeight: "700", color: brand.text, marginBottom: 16 },
  subtitle: { fontSize: 16, fontWeight: "600", color: brand.text, marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: { fontSize: 15, color: neutral.textSecondary },
  valueRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  value: { fontSize: 15, fontWeight: "600", color: brand.text },
  valuePending: { color: semantic.warning },
  dot: { width: 8, height: 8, borderRadius: 4 },
  resultBox: {
    backgroundColor: neutral.background,
    borderRadius: 6,
    borderCurve: "continuous",
    padding: 10,
    marginTop: 12,
  },
  resultText: { fontSize: 13, color: neutral.textSecondary, textAlign: "center" },

  // Establecimientos
  estabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  estabInfo: { flex: 1, marginRight: 12 },
  estabName: { fontSize: 14, fontWeight: "600", color: brand.text },
  estabCount: { fontSize: 12, color: neutral.textMuted, marginTop: 2 },
  estabBtn: {
    backgroundColor: components.buttonPrimary.background,
    borderRadius: 6,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: "center",
  },
  estabBtnDisabled: { opacity: 0.5 },
  estabBtnText: { color: brand.white, fontSize: 13, fontWeight: "600" },

  // Dead letter
  deadText: { fontSize: 13, color: semantic.destructive, marginBottom: 12 },
  deadActions: { flexDirection: "row", gap: 10 },
  deadBtn: {
    flex: 1,
    backgroundColor: neutral.background,
    borderRadius: 6,
    borderCurve: "continuous",
    paddingVertical: 10,
    alignItems: "center",
  },
  deadBtnDanger: { backgroundColor: semantic.destructiveSubtle },
  deadBtnText: { fontSize: 13, fontWeight: "600", color: brand.text },
  deadBtnDangerText: { color: semantic.destructive },

  // Sync button
  syncBtn: {
    backgroundColor: components.buttonPrimary.background,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  syncBtnDisabled: { opacity: 0.5 },
  syncBtnText: { color: brand.white, fontSize: 16, fontWeight: "700" },

  // Dev reset
  resetBtn: {
    borderWidth: 1,
    borderColor: semantic.destructiveBorder,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 32,
  },
  resetBtnText: { color: semantic.destructive, fontSize: 14, fontWeight: "600" },
});
