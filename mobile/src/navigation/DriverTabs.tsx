import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../theme";
import { AppHeader } from "../components";

import { DriverDashboardScreen } from "../screens/driver/DriverDashboardScreen";
import { RideRequestsScreen } from "../screens/driver/RideRequestsScreen";
import { ActiveTripScreen } from "../screens/driver/ActiveTripScreen";
import { TripHistoryScreen } from "../screens/driver/TripHistoryScreen";
import { InviteClientScreen } from "../screens/driver/InviteClientScreen";
import { DriverClientsScreen } from "../screens/driver/DriverClientsScreen";
import { AvailabilityScreen } from "../screens/driver/AvailabilityScreen";
import { NotificationsScreen } from "../screens/shared/NotificationsScreen";
import { ProfileScreen } from "../screens/shared/ProfileScreen";

type DriverRootStackParamList = {
  DriverDashboard: undefined;
  RideRequests: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
  InviteClient: undefined;
  DriverClients: undefined;
  Availability: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<DriverRootStackParamList>();

function DriverStack({ initialRouteName }: { initialRouteName: keyof DriverRootStackParamList }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ navigation, route }) => ({
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.card },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
        header: ["DriverDashboard", "RideRequests", "TripHistory", "DriverClients"].includes(route.name)
          ? () => (
              <AppHeader
                title={
                  route.name === "DriverDashboard"
                    ? "ChauffeurCircle"
                    : route.name === "RideRequests"
                      ? "Requests"
                      : route.name === "TripHistory"
                        ? "Trips"
                        : "Clients"
                }
                onPressNotifications={() => navigation.navigate("Notifications")}
                onPressProfile={() => navigation.navigate("Profile")}
              />
            )
          : undefined,
      })}
    >
      <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} options={{ title: "Home" }} />
      <Stack.Screen name="RideRequests" component={RideRequestsScreen} options={{ title: "Requests" }} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ title: "Active trip" }} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} options={{ title: "Trips" }} />
      <Stack.Screen name="InviteClient" component={InviteClientScreen} options={{ title: "Invite client" }} />
      <Stack.Screen name="DriverClients" component={DriverClientsScreen} options={{ title: "Clients" }} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} options={{ title: "Availability" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Stack.Navigator>
  );
}

type DriverTabParamList = {
  Home: undefined;
  Requests: undefined;
  Trips: undefined;
  Clients: undefined;
};

const Tab = createBottomTabNavigator<DriverTabParamList>();

function icon(name: keyof typeof Ionicons.glyphMap, focused: boolean) {
  return <Ionicons name={name} size={22} color={focused ? theme.colors.primary : theme.colors.textMuted} />;
}

export function DriverTabs() {
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
        children={() => <DriverStack initialRouteName="DriverDashboard" />}
      />
      <Tab.Screen
        name="Requests"
        options={{ tabBarIcon: ({ focused }) => icon("list-outline", focused) }}
        children={() => <DriverStack initialRouteName="RideRequests" />}
      />
      <Tab.Screen
        name="Trips"
        options={{ tabBarIcon: ({ focused }) => icon("car-outline", focused) }}
        children={() => <DriverStack initialRouteName="TripHistory" />}
      />
      <Tab.Screen
        name="Clients"
        options={{ tabBarIcon: ({ focused }) => icon("people-outline", focused) }}
        children={() => <DriverStack initialRouteName="DriverClients" />}
      />
    </Tab.Navigator>
  );
}
