import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { brand, neutral, semantic } from "@/constants/theme";
import type { CampoConfig, Subtarea } from "@/constants/tareas";

interface SubtareasInputProps {
  subtareas: Subtarea[];
  campos: CampoConfig[];
  onAdd: (datos: Record<string, any>) => void;
  onDelete: (subtareaId: string) => void;
  gpsLat?: number | null;
  gpsLng?: number | null;
  /** Etiqueta para el resumen (ej: "kgMS/ha") */
  unidadDefault?: string;
}

export function SubtareasInput({
  subtareas,
  campos,
  onAdd,
  onDelete,
  gpsLat,
  gpsLng,
  unidadDefault,
}: SubtareasInputProps) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Para subtareas con un solo campo numérico, mostrar promedio
  const singleNumericField = campos.length === 1 && campos[0].type === "numeric" ? campos[0] : null;

  const promedio = singleNumericField && subtareas.length > 0
    ? subtareas.reduce((sum, s) => sum + (Number(s.datos[singleNumericField.key]) || 0), 0) / subtareas.length
    : null;

  const handleAdd = () => {
    const datos: Record<string, any> = {};
    for (const campo of campos) {
      const raw = inputValues[campo.key] ?? "";
      if (campo.required && !raw) {
        Alert.alert("Campo requerido", `Ingresá ${campo.label}`);
        return;
      }
      if (campo.type === "numeric") {
        const num = parseFloat(raw);
        if (raw && isNaN(num)) {
          Alert.alert("Valor inválido", `${campo.label} debe ser un número`);
          return;
        }
        datos[campo.key] = raw ? num : null;
      } else {
        datos[campo.key] = raw || null;
      }
    }
    onAdd(datos);
    setInputValues({});
  };

  const handleDelete = (s: Subtarea) => {
    const preview = singleNumericField
      ? `${s.datos[singleNumericField.key]} ${unidadDefault ?? ""}`
      : `subtarea #${subtareas.indexOf(s) + 1}`;
    Alert.alert("Eliminar", `¿Eliminar ${preview.trim()}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => onDelete(s.id) },
    ]);
  };

  const formatSubtareaPreview = (s: Subtarea): string => {
    if (singleNumericField) {
      return `${s.datos[singleNumericField.key] ?? "—"} ${unidadDefault ?? ""}`.trim();
    }
    return campos.map((c) => `${c.label}: ${s.datos[c.key] ?? "—"}`).join(" · ");
  };

  const hasInput = campos.some((c) => (inputValues[c.key] ?? "").length > 0);

  return (
    <View style={styles.container}>
      {/* Promedio (solo para campo numérico único) */}
      {promedio != null && subtareas.length > 0 && (
        <View style={styles.promedioRow}>
          <Text style={styles.promedioLabel}>
            Promedio ({subtareas.length} muestra{subtareas.length !== 1 ? "s" : ""})
          </Text>
          <Text style={styles.promedioValue}>
            {promedio.toFixed(0)} {unidadDefault ?? ""}
          </Text>
        </View>
      )}

      {/* Lista de subtareas */}
      {subtareas.map((s, i) => (
        <View key={s.id} style={styles.subtareaRow}>
          <View style={styles.subtareaInfo}>
            <Text style={styles.subtareaIndex}>#{i + 1}</Text>
            <Text style={styles.subtareaValor}>{formatSubtareaPreview(s)}</Text>
            {s.gps_lat != null && (
              <Text style={styles.subtareaGps}>
                GPS {s.gps_lat.toFixed(5)}, {s.gps_lng?.toFixed(5)}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleDelete(s)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Input nueva subtarea */}
      <View style={styles.addSection}>
        {campos.map((campo) => (
          <TextInput
            key={campo.key}
            style={styles.input}
            value={inputValues[campo.key] ?? ""}
            onChangeText={(t) => setInputValues((prev) => ({ ...prev, [campo.key]: t }))}
            placeholder={`${campo.label}${unidadDefault && singleNumericField ? ` (${unidadDefault})` : ""}`}
            placeholderTextColor={neutral.inputPlaceholder}
            keyboardType={campo.type === "numeric" ? "numeric" : "default"}
            returnKeyType="done"
            onSubmitEditing={campos.length === 1 ? handleAdd : undefined}
          />
        ))}
        <TouchableOpacity
          style={[styles.addBtn, !hasInput && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!hasInput}
        >
          <Text style={styles.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {gpsLat != null && (
        <Text style={styles.gpsHint}>
          GPS actual: {gpsLat.toFixed(5)}, {gpsLng?.toFixed(5)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  promedioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: semantic.successSubtle,
    padding: 10,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  promedioLabel: { fontSize: 13, color: "#2e7d32", fontWeight: "500" },
  promedioValue: { fontSize: 16, color: "#2e7d32", fontWeight: "700" },
  subtareaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: neutral.surface,
    padding: 10,
    borderRadius: 6,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: neutral.borderSubtle,
  },
  subtareaInfo: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  subtareaIndex: { fontSize: 12, color: neutral.textMuted, fontWeight: "600" },
  subtareaValor: { fontSize: 14, color: brand.text, fontWeight: "600" },
  subtareaGps: { fontSize: 10, color: neutral.textMuted },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 14, color: semantic.destructive },
  addSection: { gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: neutral.border,
    borderRadius: 8,
    borderCurve: "continuous",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: brand.text,
    backgroundColor: neutral.surface,
  },
  addBtn: {
    backgroundColor: brand.primary,
    borderRadius: 8,
    borderCurve: "continuous",
    paddingVertical: 10,
    alignItems: "center",
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: brand.white, fontWeight: "600", fontSize: 13 },
  gpsHint: { fontSize: 11, color: neutral.textMuted, textAlign: "right" },
});
