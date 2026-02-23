import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Controller, type Control } from "react-hook-form";
import { type CampoConfig } from "@/constants/tareas";
import { TagsInput } from "./TagsInput";
import { brand, neutral } from "@/constants/theme";

interface DynamicFormProps {
  campos: CampoConfig[];
  control: Control<any>;
}

export function DynamicForm({ campos, control }: DynamicFormProps) {
  return (
    <View style={styles.container}>
      {campos.map((campo) => (
        <View key={campo.key} style={styles.fieldGroup}>
          <Text style={styles.label}>
            {campo.label}
            {campo.required !== false && <Text style={styles.required}> *</Text>}
          </Text>
          <Controller
            control={control}
            name={`datos.${campo.key}`}
            rules={campo.required !== false ? { required: `${campo.label} es requerido` } : undefined}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <FieldRenderer campo={campo} value={value} onChange={onChange} />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />
        </View>
      ))}
    </View>
  );
}

function FieldRenderer({
  campo,
  value,
  onChange,
}: {
  campo: CampoConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  switch (campo.type) {
    case "text":
      return (
        <TextInput
          style={styles.input}
          value={value ?? ""}
          onChangeText={onChange}
          placeholder={`Ingresá ${campo.label.toLowerCase()}`}
          placeholderTextColor={neutral.inputPlaceholder}
        />
      );

    case "textarea":
      return (
        <TextInput
          style={[styles.input, styles.textArea]}
          value={value ?? ""}
          onChangeText={onChange}
          placeholder={`Ingresá ${campo.label.toLowerCase()}`}
          placeholderTextColor={neutral.inputPlaceholder}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      );

    case "numeric":
      return (
        <TextInput
          style={styles.input}
          value={value != null ? String(value) : ""}
          onChangeText={(t) => {
            const num = parseFloat(t);
            onChange(isNaN(num) ? t : num);
          }}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={neutral.inputPlaceholder}
        />
      );

    case "date":
      return <DateField value={value} onChange={onChange} />;

    case "chips":
      return (
        <ChipsSelector
          options={campo.options ?? []}
          selected={value ?? ""}
          onSelect={onChange}
        />
      );

    case "chips_multi":
      return (
        <TagsInput
          options={campo.options ?? []}
          selected={value ?? []}
          onChange={onChange}
        />
      );

    case "fotos":
      // Placeholder — fotos se manejan en la pantalla de tarea
      return (
        <Text style={styles.placeholder}>
          Las fotos se agregan desde la pantalla de tarea
        </Text>
      );

    default:
      return null;
  }
}

function DateField({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [text, setText] = useState(value ?? "");

  const handleChange = (t: string) => {
    setText(t);
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
      onChange(t);
    }
  };

  return (
    <TextInput
      style={styles.input}
      value={text}
      onChangeText={handleChange}
      placeholder="YYYY-MM-DD"
      placeholderTextColor={neutral.inputPlaceholder}
      keyboardType={process.env.EXPO_OS === "ios" ? "numbers-and-punctuation" : "default"}
      maxLength={10}
    />
  );
}

function ChipsSelector({
  options,
  selected,
  onSelect,
}: {
  options: readonly { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.chipsRow}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(isSelected ? "" : opt.value)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: brand.text,
  },
  required: { color: "#c62828" },
  errorText: {
    color: "#c62828",
    fontSize: 12,
    marginTop: 2,
  },
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
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: neutral.border,
  },
  chipSelected: {
    backgroundColor: brand.primary,
    borderColor: brand.primary,
  },
  chipText: {
    fontSize: 13,
    color: neutral.textSecondary,
  },
  chipTextSelected: {
    color: brand.white,
    fontWeight: "600",
  },
  placeholder: {
    fontSize: 13,
    color: neutral.textMuted,
    fontStyle: "italic",
  },
});
