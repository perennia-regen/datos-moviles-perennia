import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { brand, neutral } from "@/constants/theme";

interface TagsInputProps {
  options: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ options, selected, onChange }: TagsInputProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => toggle(opt.value)}
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
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
});
