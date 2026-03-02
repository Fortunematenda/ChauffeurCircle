import { apiClient } from "./apiClient";

export type DriverRide = {
  publicId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  scheduledTime: string | null;
  tripId: string | null;
  tripStatus: "ONGOING" | "COMPLETED" | null;
  clientPhoneNumber: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
};

export async function getDriverRides(): Promise<{ rides: DriverRide[] }> {
  const res = await apiClient.get<{ rides: DriverRide[] }>("/rides/driver");
  return res.data;
}

export async function respondToRide(params: {
  rideRequestId: string;
  action: "ACCEPT" | "REJECT";
}): Promise<{ status: "ACCEPTED" | "REJECTED" }> {
  const res = await apiClient.post<{ status: "ACCEPTED" | "REJECTED" }>("/rides/respond", params);
  return res.data;
}
