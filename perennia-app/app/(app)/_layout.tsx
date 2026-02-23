import { Image, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { components } from "@/constants/theme";

function HeaderLogo() {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../assets/isologo.png")}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

function HeaderBack() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <Text style={styles.backArrow}>‹</Text>
    </TouchableOpacity>
  );
}

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: components.header.background },
        headerTintColor: components.header.tint,
        headerTitleStyle: { fontWeight: "600" as const },
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mis Servicios", headerLeft: () => <HeaderLogo /> }} />
      <Stack.Screen name="establecimientos" options={{ title: "Establecimientos", headerLeft: () => <HeaderBack /> }} />
      <Stack.Screen name="establecimiento/[id]" options={{ title: "Establecimiento", headerLeft: () => <HeaderBack /> }} />
      <Stack.Screen name="servicio/[id]" options={{ title: "Servicio", headerLeft: () => <HeaderBack /> }} />
      <Stack.Screen name="recorrida/[id]" options={{ title: "Recorrida", headerLeft: () => <HeaderBack /> }} />
      <Stack.Screen name="navegacion/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="tarea/[id]" options={{ title: "Tarea", headerLeft: () => <HeaderBack /> }} />
      <Stack.Screen name="sync" options={{ title: "Sincronización", headerLeft: () => <HeaderBack /> }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
  },
  backArrow: {
    color: components.header.tint,
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
  },
});
