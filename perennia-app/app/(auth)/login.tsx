import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { brand, neutral, components } from "@/constants/theme";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginForm) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert("Error de autenticación", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Recorrida Holística</Text>

        <Controller
          control={control}
          name="email"
          rules={{ required: "Ingresá tu email" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={neutral.textPlaceholder}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Ingresá tu contraseña" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Contraseña"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholderTextColor={neutral.textPlaceholder}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          )}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={brand.white} />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
    justifyContent: "center",
  },
  form: {
    paddingHorizontal: 32,
  },
  logo: {
    width: 220,
    height: 100,
    alignSelf: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: neutral.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: neutral.surface,
    borderRadius: components.input.radius,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: neutral.border,
    color: brand.text,
  },
  inputError: {
    borderColor: "#c62828",
  },
  errorText: {
    color: "#c62828",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: components.buttonPrimary.background,
    borderRadius: 8,
    borderCurve: "continuous",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: components.buttonPrimary.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
