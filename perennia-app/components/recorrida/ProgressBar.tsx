import { View, Text, StyleSheet } from "react-native";
import { brand, neutral } from "../../constants/theme";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.text}>
        {completed}/{total} completas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: neutral.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    backgroundColor: brand.primary,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    color: neutral.textSecondary,
    fontWeight: "500",
  },
});
