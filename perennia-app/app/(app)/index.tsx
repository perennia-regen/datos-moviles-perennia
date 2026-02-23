import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useEducador } from "@/hooks/useEducador";
import { getAll, bulkInsert } from "@/db/operations";
import { getDb } from "@/db/schema";
import { brand, neutral, semantic, components } from "@/constants/theme";

interface Servicio {
  id_servicio: string;
  id_establecimiento: string;
  nombre_establecimiento: string;
  servicio: string;
  fecha: string | null;
  fecha_fin: string | null;
  estado_trabajo: number;
  educadores: string;
  downloaded_at: string | null;
}

const ESTADO_LABELS: Record<number, string> = {
  3: "Agendado",
  4: "Por rendir",
};

export default function ServiciosScreen() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [lotesCount, setLotesCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { pendingCount, isSyncing, isConnected } = useOfflineSync();
  const { educadorId, loading: educadorLoading } = useEducador();

  const loadLocalServicios = useCallback(async () => {
    const local = await getAll<Servicio>("dc_servicio");
    setServicios(local);

    // Contar lotes descargados por establecimiento
    const db = await getDb();
    const counts = await db.getAllAsync<{ id_establecimiento: string; count: number }>(
      "SELECT id_establecimiento, COUNT(*) as count FROM dc_lote GROUP BY id_establecimiento"
    );
    const map: Record<string, number> = {};
    for (const c of counts) {
      map[c.id_establecimiento] = c.count;
    }
    setLotesCount(map);
  }, []);

  const fetchServiciosRemote = useCallback(async () => {
    if (!educadorId) return;
    try {
      const { data, error } = await supabase.rpc("get_servicios_educador", {
        p_educador_id: educadorId,
      });
      if (error) throw error;
      if (data && data.length > 0) {
        // Preservar downloaded_at de servicios ya existentes localmente
        const existingMap: Record<string, string | null> = {};
        for (const s of servicios) {
          existingMap[s.id_servicio] = s.downloaded_at;
        }

        const db = await getDb();
        await db.runAsync("DELETE FROM dc_servicio");
        await bulkInsert(
          "dc_servicio",
          data.map((s: any) => ({
            id_servicio: s.id_servicio,
            id_establecimiento: s.id_establecimiento,
            nombre_establecimiento: s.nombre_establecimiento,
            servicio: s.servicio,
            fecha: s.fecha,
            fecha_fin: s.fecha_fin,
            estado_trabajo: s.estado_trabajo,
            educadores: JSON.stringify(s.educadores),
            downloaded_at: existingMap[s.id_servicio] ?? null,
          }))
        );
      }
      await loadLocalServicios();
    } catch (e: unknown) {
      console.error("Error fetching servicios:", e);
      // Si falla el remote, cargar desde local
      await loadLocalServicios();
    }
  }, [educadorId, servicios, loadLocalServicios]);

  useEffect(() => {
    if (educadorLoading) return;
    if (!educadorId) {
      setLoading(false);
      return;
    }

    (async () => {
      // Primero cargar local (rápido)
      await loadLocalServicios();
      setLoading(false);

      // Luego intentar actualizar desde remoto si hay conexión
      if (isConnected) {
        await fetchServiciosRemote();
      }
    })();
  }, [educadorId, educadorLoading]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServiciosRemote();
    setRefreshing(false);
  }, [fetchServiciosRemote]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading || educadorLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <View style={[styles.dot, { backgroundColor: isConnected ? semantic.success : semantic.destructive }]} />
          <Text style={styles.statusText}>
            {isConnected ? "Online" : "Offline"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.syncTap}
          hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
          onPress={() => router.navigate("/(app)/sync" as any)}
        >
          <Text style={pendingCount > 0 ? styles.pendingText : styles.syncLink}>
            {isSyncing
              ? "Sincronizando..."
              : pendingCount > 0
                ? `${pendingCount} pendiente${pendingCount > 1 ? "s" : ""}`
                : "Sync"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id_servicio}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.push("/(app)/establecimientos")}
          >
            <Text style={styles.linkBtnText}>Ver establecimientos</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isConnected
              ? "No tenés servicios agendados"
              : "Sin conexión. Tirá hacia abajo para actualizar cuando tengas señal."}
          </Text>
        }
        renderItem={({ item }) => {
          const lotes = lotesCount[item.id_establecimiento] ?? 0;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(app)/servicio/${item.id_servicio}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.nombre_establecimiento}
                </Text>
                <View
                  style={[
                    styles.badge,
                    item.estado_trabajo === 4 && styles.badgeWarning,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.estado_trabajo === 4 && styles.badgeTextWarning,
                    ]}
                  >
                    {ESTADO_LABELS[item.estado_trabajo] ?? `Estado ${item.estado_trabajo}`}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.servicio}
              </Text>
              <View style={styles.cardFooter}>
                {item.fecha && (
                  <Text style={styles.cardDate}>{item.fecha}</Text>
                )}
                <Text style={[styles.cardLotes, lotes > 0 && styles.cardLotesOk]}>
                  {lotes > 0 ? `${lotes} lotes` : "Sin datos"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral.background,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: neutral.borderSubtle,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: neutral.textSecondary,
  },
  pendingText: {
    fontSize: 13,
    color: semantic.warning,
    fontWeight: "500",
  },
  syncTap: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  syncLink: {
    fontSize: 13,
    color: neutral.textPlaceholder,
  },
  logoutText: {
    fontSize: 13,
    color: neutral.textPlaceholder,
  },
  linkBtn: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  linkBtnText: {
    fontSize: 14,
    color: brand.primary,
    fontWeight: "500",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: neutral.surface,
    borderRadius: components.card.radius,
    borderCurve: "continuous",
    padding: 16,
    marginBottom: 10,
    boxShadow: components.card.boxShadow,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: brand.text,
    flex: 1,
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: neutral.textMuted,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardDate: {
    fontSize: 13,
    color: neutral.textSecondary,
  },
  cardLotes: {
    fontSize: 12,
    color: neutral.textPlaceholder,
  },
  cardLotesOk: {
    color: brand.primary,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: components.badge.background,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: components.badge.text,
  },
  badgeWarning: {
    backgroundColor: components.badgeWarning.background,
  },
  badgeTextWarning: {
    color: components.badgeWarning.text,
  },
  emptyText: {
    textAlign: "center",
    color: neutral.textPlaceholder,
    marginTop: 40,
    fontSize: 15,
    lineHeight: 22,
  },
});
