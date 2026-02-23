import { View, Text, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { brand, neutral } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "No encontrada" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla no encontrada</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: neutral.background,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: brand.text,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 15,
    color: brand.primary,
    fontWeight: "500",
  },
});
