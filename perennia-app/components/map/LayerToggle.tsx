import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { layerColors } from "../../constants/theme";

export interface LayerVisibility {
  perimetro: boolean;
  lotes: boolean;
  ambientes: boolean;
  ambienteLotes: boolean;
}

interface LayerToggleProps {
  layers: LayerVisibility;
  onToggle: (layer: keyof LayerVisibility) => void;
  hasAmbienteLotes: boolean;
}

const LAYER_CONFIG: {
  key: keyof LayerVisibility;
  label: string;
  color: string;
}[] = [
  { key: "perimetro", label: "Perímetro", color: layerColors.perimetro },
  { key: "lotes", label: "Lotes", color: layerColors.lotes },
  { key: "ambientes", label: "Ambientes", color: layerColors.ambientes },
  { key: "ambienteLotes", label: "Lote × Amb", color: layerColors.ambienteLotes },
];

export function LayerToggle({ layers, onToggle, hasAmbienteLotes }: LayerToggleProps) {
  return (
    <View style={styles.container}>
      {LAYER_CONFIG.map(({ key, label, color }) => {
        const active = layers[key];
        const disabled = key === "ambienteLotes" && !hasAmbienteLotes;

        return (
          <TouchableOpacity
            key={key}
            style={[styles.row, disabled && styles.rowDisabled]}
            onPress={() => !disabled && onToggle(key)}
            activeOpacity={disabled ? 1 : 0.7}
          >
            <View
              style={[
                styles.indicator,
                { borderColor: color },
                active && { backgroundColor: color },
                disabled && styles.indicatorDisabled,
              ]}
            />
            <Text style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    minHeight: 44,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginRight: 8,
  },
  indicatorDisabled: {
    borderColor: "#666",
  },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  labelDisabled: {
    color: "#888",
  },
});
