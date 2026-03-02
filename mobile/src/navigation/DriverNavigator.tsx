import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DriverDashboardScreen } from "../screens/driver/DriverDashboardScreen";
import { InviteClientScreen } from "../screens/driver/InviteClientScreen";
import { RideRequestsScreen } from "../screens/driver/RideRequestsScreen";
import { ActiveTripScreen } from "../screens/driver/ActiveTripScreen";
import { TripHistoryScreen } from "../screens/driver/TripHistoryScreen";
import { AvailabilityScreen } from "../screens/driver/AvailabilityScreen";

export type DriverStackParamList = {
  DriverDashboard: undefined;
  InviteClient: undefined;
  RideRequests: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
  Availability: undefined;
};

const Stack = createNativeStackNavigator<DriverStackParamList>();

export function DriverNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} options={{ title: "Driver" }} />
      <Stack.Screen name="InviteClient" component={InviteClientScreen} options={{ title: "Invite client" }} />
      <Stack.Screen name="RideRequests" component={RideRequestsScreen} options={{ title: "Ride requests" }} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ title: "Active trip" }} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} options={{ title: "Trip history" }} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} options={{ title: "Availability" }} />
    </Stack.Navigator>
  );
}
