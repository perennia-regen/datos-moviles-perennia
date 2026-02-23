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
import { supabase } from "../../lib/supabase";
import { useEducador } from "../../hooks/useEducador";
import { brand, neutral, semantic, components } from "../../constants/theme";

interface Establecimiento {
  id_establecimiento: string;
  nombre_establecimiento: string;
  localidad: string | null;
  grupo: string | null;
}

export default function EstablecimientosScreen() {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { educadorId } = useEducador();

  const fetchEstablecimientos = useCallback(async () => {
    try {
      let query = supabase
        .from("establecimientos")
        .select("id_establecimiento, nombre_establecimiento, localidad, grupo")
        .eq("is_deleted", false)
        .in("estado", ["Activo", "Activo Previo", "Activo Convenio"])
        .order("nombre_establecimiento");

      if (educadorId) {
        query = query.eq("tecnico_responsable", educadorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEstablecimientos(data ?? []);
    } catch (e: any) {
      console.error("Error fetching establecimientos:", e);
      Alert.alert("Error", "No se pudieron cargar los establecimientos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [educadorId]);

  useEffect(() => {
    if (educadorId !== null) fetchEstablecimientos();
  }, [educadorId, fetchEstablecimientos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEstablecimientos();
  }, [fetchEstablecimientos]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={establecimientos}
        keyExtractor={(item) => item.id_establecimiento}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tenés establecimientos asignados</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(app)/establecimiento/${item.id_establecimiento}`)}
          >
            <Text style={styles.cardTitle}>{item.nombre_establecimiento}</Text>
            <View style={styles.cardMeta}>
              {item.localidad && <Text style={styles.cardSubtitle}>{item.localidad}</Text>}
              {item.grupo && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.grupo}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: neutral.surface,
    borderRadius: components.card.radius,
    padding: 16,
    marginBottom: 10,
    shadowColor: components.card.shadow.color,
    shadowOffset: { width: 0, height: components.card.shadow.offsetY },
    shadowOpacity: components.card.shadow.opacity,
    shadowRadius: components.card.shadow.radius,
    elevation: components.card.shadow.elevation,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: brand.text,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: neutral.textMuted,
  },
  badge: {
    backgroundColor: components.badge.background,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: components.badge.text,
  },
  emptyText: {
    textAlign: "center",
    color: neutral.textPlaceholder,
    marginTop: 40,
    fontSize: 15,
  },
});
