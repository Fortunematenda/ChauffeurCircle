import { apiClient } from "./apiClient";

export type TripDetails = {
  trip: {
    tripId: string;
    status: "ONGOING" | "COMPLETED";
    startTime: string;
    endTime: string | null;
    fare: number | null;
    rideRequestId: string;
    rideRequestStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
    driverPhoneNumber: string;
    clientPhoneNumber: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    latestLocation: { latitude: number; longitude: number; timestamp: string } | null;
  };
};

export async function getTrip(tripId: string): Promise<TripDetails> {
  const res = await apiClient.get<TripDetails>(`/trip/${tripId}`);
  return res.data;
}

export async function startTrip(params: { rideRequestId: string }): Promise<{ tripId: string; status: "ONGOING" }> {
  const res = await apiClient.post<{ tripId: string; status: "ONGOING" }>("/trip/start", params);
  return res.data;
}

export async function sendLocation(params: {
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
}): Promise<void> {
  await apiClient.post("/trip/location", params);
}

export async function endTrip(params: { tripId: string; fare?: number }): Promise<{ status: "COMPLETED" }> {
  const res = await apiClient.post<{ status: "COMPLETED" }>("/trip/end", params);
  return res.data;
}
