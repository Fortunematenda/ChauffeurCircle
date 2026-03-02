import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../theme";
import { AppHeader } from "../components";

import { ClientDashboardScreen } from "../screens/client/ClientDashboardScreen";
import { RequestRideScreen } from "../screens/client/RequestRideScreen";
import { MyRequestsScreen } from "../screens/client/MyRequestsScreen";
import { DriversScreen } from "../screens/client/DriversScreen";
import { ClientActiveTripScreen } from "../screens/client/ClientActiveTripScreen";
import { ClientTripHistoryScreen } from "../screens/client/ClientTripHistoryScreen";
import { NotificationsScreen } from "../screens/shared/NotificationsScreen";
import { ProfileScreen } from "../screens/shared/ProfileScreen";

type ClientRootStackParamList = {
  ClientDashboard: undefined;
  RequestRide: undefined;
  MyRequests: undefined;
  Drivers: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ClientRootStackParamList>();

function ClientStack({ initialRouteName }: { initialRouteName: keyof ClientRootStackParamList }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ navigation, route }) => ({
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.card },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
        header: ["ClientDashboard", "RequestRide", "MyRequests", "Drivers"].includes(route.name)
          ? () => (
              <AppHeader
                title={
                  route.name === "ClientDashboard"
                    ? "ChauffeurCircle"
                    : route.name === "RequestRide"
                      ? "Request Ride"
                      : route.name === "MyRequests"
                        ? "History"
                        : "Drivers"
                }
                onPressNotifications={() => navigation.navigate("Notifications")}
                onPressProfile={() => navigation.navigate("Profile")}
              />
            )
          : undefined,
      })}
    >
      <Stack.Screen name="ClientDashboard" component={ClientDashboardScreen} options={{ title: "Home" }} />
      <Stack.Screen name="RequestRide" component={RequestRideScreen} options={{ title: "Request ride" }} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} options={{ title: "History" }} />
      <Stack.Screen name="Drivers" component={DriversScreen} options={{ title: "Drivers" }} />
      <Stack.Screen name="ActiveTrip" component={ClientActiveTripScreen} options={{ title: "Active trip" }} />
      <Stack.Screen name="TripHistory" component={ClientTripHistoryScreen} options={{ title: "Trip history" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Stack.Navigator>
  );
}

type ClientTabParamList = {
  Home: undefined;
  RequestRide: undefined;
  History: undefined;
  Drivers: undefined;
};

const Tab = createBottomTabNavigator<ClientTabParamList>();

function icon(name: keyof typeof Ionicons.glyphMap, focused: boolean) {
  return <Ionicons name={name} size={22} color={focused ? theme.colors.primary : theme.colors.textMuted} />;
}

export function ClientTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{ tabBarIcon: ({ focused }) => icon("home-outline", focused) }}
        children={() => <ClientStack initialRouteName="ClientDashboard" />}
      />
      <Tab.Screen
        name="RequestRide"
        options={{ title: "Request Ride", tabBarIcon: ({ focused }) => icon("add-circle-outline", focused) }}
        children={() => <ClientStack initialRouteName="RequestRide" />}
      />
      <Tab.Screen
        name="History"
        options={{ tabBarIcon: ({ focused }) => icon("time-outline", focused) }}
        children={() => <ClientStack initialRouteName="MyRequests" />}
      />
      <Tab.Screen
        name="Drivers"
        options={{ tabBarIcon: ({ focused }) => icon("people-outline", focused) }}
        children={() => <ClientStack initialRouteName="Drivers" />}
      />
    </Tab.Navigator>
  );
}
