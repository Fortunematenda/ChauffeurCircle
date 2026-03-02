import { apiClient } from "./apiClient";

export type DriverRelationship = {
  driverPhoneNumber: string;
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  createdAt: string;
};

export async function getDrivers(): Promise<{ drivers: DriverRelationship[] }> {
  const res = await apiClient.get<{ drivers: DriverRelationship[] }>("/client/drivers");
  return res.data;
}

export async function acceptInvite(params: { driverPhoneNumber: string }): Promise<{ status: "PENDING" | "ACTIVE" | "BLOCKED" }> {
  const res = await apiClient.post<{ status: "PENDING" | "ACTIVE" | "BLOCKED" }>("/client/accept-invite", params);
  return res.data;
}
