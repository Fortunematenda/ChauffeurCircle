import { apiClient } from "./apiClient";

export type ClientRide = {
  publicId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  scheduledTime: string | null;
  tripId: string | null;
  tripStatus: "ONGOING" | "COMPLETED" | null;
  driverPhoneNumber: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
};

export async function getClientRides(): Promise<{ rides: ClientRide[] }> {
  const res = await apiClient.get<{ rides: ClientRide[] }>("/rides/client");
  return res.data;
}

export async function requestRide(params: {
  driverPhoneNumber: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  scheduledTime?: string;
}): Promise<{ rideRequestId: string; status: "PENDING" }> {
  const res = await apiClient.post<{ publicId: string; status: "PENDING" }>("/rides/request", params);
  return { rideRequestId: res.data.publicId, status: res.data.status };
}
