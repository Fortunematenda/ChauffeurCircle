import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "../stores/authStore";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { LoadingScreen } from "../screens/shared/LoadingScreen";
import { BottomTabNavigator } from "./BottomTabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (!isBootstrapped) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
          </>
        ) : (
          <Stack.Screen
            name="App"
            options={{ headerShown: false }}
            children={() => <BottomTabNavigator role={role ?? "CLIENT"} />}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
