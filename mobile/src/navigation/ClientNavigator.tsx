import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ClientDashboardScreen } from "../screens/client/ClientDashboardScreen";
import { DriversScreen } from "../screens/client/DriversScreen";
import { RequestRideScreen } from "../screens/client/RequestRideScreen";
import { MyRequestsScreen } from "../screens/client/MyRequestsScreen";
import { ClientActiveTripScreen } from "../screens/client/ClientActiveTripScreen";
import { ClientTripHistoryScreen } from "../screens/client/ClientTripHistoryScreen";

export type ClientStackParamList = {
  ClientDashboard: undefined;
  Drivers: undefined;
  RequestRide: undefined;
  MyRequests: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

export function ClientNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClientDashboard" component={ClientDashboardScreen} options={{ title: "Client" }} />
      <Stack.Screen name="Drivers" component={DriversScreen} options={{ title: "Drivers" }} />
      <Stack.Screen name="RequestRide" component={RequestRideScreen} options={{ title: "Request ride" }} />
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} options={{ title: "My requests" }} />
      <Stack.Screen name="ActiveTrip" component={ClientActiveTripScreen} options={{ title: "Active trip" }} />
      <Stack.Screen name="TripHistory" component={ClientTripHistoryScreen} options={{ title: "Trip history" }} />
    </Stack.Navigator>
  );
}
