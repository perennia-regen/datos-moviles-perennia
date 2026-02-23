import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import type { TareaEstado, TareaTipoConfig } from "@/constants/tareas";
import { StatusBadge } from "./StatusBadge";
import { brand, neutral } from "@/constants/theme";

interface TareaItem {
  id: string;
  tarea_tipo_id: string;
  lote_id: string | null;
  ambiente_id: string | null;
  estado: string;
  datos: string;
  titulo: string | null;
  orden: number;
}

interface LoteInfo {
  id: string;
  nombre_lote: string;
  has: number | null;
}

interface AmbienteInfo {
  id: string;
  nombre: string;
  has: number | null;
}

interface TaskListViewProps {
  tareas: TareaItem[];
  tareaTipos: TareaTipoConfig[];
  lotes: Map<string, LoteInfo>;
  ambientes: Map<string, AmbienteInfo>;
}

interface SectionData {
  title: string;
  tipoId: string;
  nivel: string;
  data: TareaItem[];
}

export function TaskListView({ tareas, tareaTipos, lotes, ambientes }: TaskListViewProps) {
  const router = useRouter();
  const [expandedLotes, setExpandedLotes] = useState<Set<string>>(new Set());

  const tipoMap = new Map(tareaTipos.map((t) => [t.id, t]));

  // Agrupar por tipo de tarea
  const sections: SectionData[] = [];
  const grouped = new Map<string, TareaItem[]>();

  for (const t of tareas) {
    const arr = grouped.get(t.tarea_tipo_id) ?? [];
    arr.push(t);
    grouped.set(t.tarea_tipo_id, arr);
  }

  for (const tipo of tareaTipos) {
    const items = grouped.get(tipo.id);
    if (!items || items.length === 0) continue;
    sections.push({ title: tipo.nombre, tipoId: tipo.id, nivel: tipo.nivel, data: items });
  }

  const toggleLote = (loteId: string) => {
    setExpandedLotes((prev) => {
      const next = new Set(prev);
      if (next.has(loteId)) next.delete(loteId);
      else next.add(loteId);
      return next;
    });
  };

  const getPreview = (tarea: TareaItem): string => {
    if (tarea.estado === "sin_iniciar") return "Sin iniciar";
    try {
      const datos = JSON.parse(tarea.datos || "{}");
      const parts: string[] = [];
      for (const val of Object.values(datos)) {
        if (val && typeof val === "string" && val.length < 40) parts.push(val);
        if (parts.length >= 3) break;
      }
      return parts.join(" · ") || "En curso";
    } catch {
      return "";
    }
  };

  const renderAmbienteTarea = (tarea: TareaItem) => {
    const amb = tarea.ambiente_id ? ambientes.get(tarea.ambiente_id) : null;
    return (
      <TouchableOpacity
        key={tarea.id}
        style={styles.ambienteRow}
        onPress={() => router.push(`/(app)/navegacion/${tarea.id}`)}
      >
        <View style={styles.ambienteInfo}>
          <StatusBadge estado={tarea.estado as TareaEstado} compact />
          <Text style={styles.ambienteName}>
            {amb?.nombre ?? "Sin ambiente"}
          </Text>
          {amb?.has != null && (
            <Text style={styles.ambienteHas}>{amb.has} ha</Text>
          )}
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {getPreview(tarea)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, section }: { item: TareaItem; section: SectionData }) => {
    const tipoConfig = tipoMap.get(section.tipoId);

    // Para tareas nivel ambiente: agrupar por lote con expand/collapse
    if (section.nivel === "ambiente" && item.lote_id) {
      const loteTareas = section.data.filter((t) => t.lote_id === item.lote_id);
      if (loteTareas[0]?.id !== item.id) return null;

      const lote = lotes.get(item.lote_id);
      const isExpanded = expandedLotes.has(item.lote_id);
      const completadas = loteTareas.filter((t) => t.estado === "completa").length;

      return (
        <View style={styles.loteGroup}>
          <TouchableOpacity
            style={styles.loteHeader}
            onPress={() => toggleLote(item.lote_id!)}
          >
            <Text style={styles.loteArrow}>{isExpanded ? "▼" : "▶"}</Text>
            <Text style={styles.loteName}>
              {lote?.nombre_lote ?? "Lote"}
            </Text>
            {lote?.has != null && (
              <Text style={styles.loteHas}>{lote.has} ha</Text>
            )}
            <Text style={styles.loteCount}>
              {completadas}/{loteTareas.length}
            </Text>
          </TouchableOpacity>
          {isExpanded && loteTareas.map(renderAmbienteTarea)}
        </View>
      );
    }

    // Tareas nivel lote o libre
    const lote = item.lote_id ? lotes.get(item.lote_id) : null;

    return (
      <TouchableOpacity
        style={styles.tareaCard}
        onPress={() => router.push(`/(app)/navegacion/${item.id}`)}
      >
        <View style={styles.tareaInfo}>
          <StatusBadge estado={item.estado as TareaEstado} compact />
          <Text style={styles.tareaName}>
            {tipoConfig?.id === "libre"
              ? item.titulo ?? "Tarea libre"
              : lote?.nombre_lote ?? "Lote"}
          </Text>
          {lote?.has != null && (
            <Text style={styles.tareaHas}>{lote.has} ha</Text>
          )}
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {getPreview(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: neutral.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  tareaCard: {
    backgroundColor: neutral.surface,
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 8,
    borderCurve: "continuous",
    padding: 12,
  },
  tareaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tareaName: { fontSize: 14, fontWeight: "600", color: brand.text, flex: 1 },
  tareaHas: { fontSize: 12, color: neutral.textMuted },
  preview: { fontSize: 12, color: neutral.textMuted, marginTop: 3, marginLeft: 16 },
  loteGroup: {
    marginHorizontal: 16,
    marginBottom: 6,
    backgroundColor: neutral.surface,
    borderRadius: 8,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  loteHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  loteArrow: { fontSize: 10, color: neutral.textMuted, width: 14 },
  loteName: { fontSize: 14, fontWeight: "600", color: brand.text, flex: 1 },
  loteHas: { fontSize: 12, color: neutral.textMuted },
  loteCount: { fontSize: 11, color: neutral.textMuted, fontWeight: "500" },
  ambienteRow: {
    paddingLeft: 34,
    paddingRight: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: neutral.borderSubtle,
  },
  ambienteInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ambienteName: { fontSize: 13, fontWeight: "500", color: brand.text, flex: 1 },
  ambienteHas: { fontSize: 11, color: neutral.textMuted },
});
