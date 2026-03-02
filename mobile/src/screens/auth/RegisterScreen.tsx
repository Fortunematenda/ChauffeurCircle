import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuthStore } from "../../stores/authStore";
import { getApiErrorMessage } from "../../utils/apiError";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const trimmedPhone = phoneNumber.trim();
  const trimmedPassword = password.trim();
  const canSubmit = trimmedPhone.length > 0 && trimmedPassword.length >= 8;

  async function onRegister() {
    if (trimmedPhone.length === 0) {
      Alert.alert("Registration failed", "Phone number is required.");
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert("Registration failed", "Password must be at least 8 characters.");
      return;
    }

    try {
      setBusy(true);
      await register({ phoneNumber, password });
    } catch (e) {
      Alert.alert("Registration failed", getApiErrorMessage(e, "Unknown error (reload Expo with -c)"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        autoCapitalize="none"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password (min 8 chars)"
        secureTextEntry
        style={styles.input}
      />

      <Button title={busy ? "Creating..." : "Register"} onPress={onRegister} disabled={busy || !canSubmit} />

      <View style={styles.spacer} />

      <Button title="Back to login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
});
