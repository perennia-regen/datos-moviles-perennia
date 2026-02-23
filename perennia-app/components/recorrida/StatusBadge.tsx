import { View, Text, StyleSheet } from "react-native";
import { type TareaEstado } from "@/constants/tareas";
import { semantic, neutral } from "@/constants/theme";

const STATUS_CONFIG: Record<TareaEstado, { dot: string; label: string; bg: string; text: string }> = {
  sin_iniciar: { dot: neutral.textMuted, label: "Sin iniciar", bg: "#f0f0f0", text: neutral.textSecondary },
  en_curso: { dot: semantic.warning, label: "En curso", bg: semantic.warningSubtle, text: semantic.warning },
  completa: { dot: semantic.success, label: "Completa", bg: semantic.successSubtle, text: "#2e7d32" },
};

interface StatusBadgeProps {
  estado: TareaEstado;
  compact?: boolean;
}

export function StatusBadge({ estado, compact = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[estado] ?? STATUS_CONFIG.sin_iniciar;

  if (compact) {
    return <View style={[styles.dot, { backgroundColor: config.dot }]} />;
  }

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
});
