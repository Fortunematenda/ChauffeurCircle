import { apiClient } from "./apiClient";

export async function inviteClient(params: { clientPhoneNumber: string }): Promise<{ status: "PENDING" | "ACTIVE" | "BLOCKED" }> {
  const res = await apiClient.post<{ status: "PENDING" | "ACTIVE" | "BLOCKED" }>("/driver/invite", params);
  return res.data;
}

export async function getClients(): Promise<{
  clients: Array<{ clientPhoneNumber: string; status: "PENDING" | "ACTIVE" | "BLOCKED"; createdAt: string }>;
}> {
  const res = await apiClient.get<{
    clients: Array<{ clientPhoneNumber: string; status: "PENDING" | "ACTIVE" | "BLOCKED"; createdAt: string }>;
  }>("/driver/clients");
  return res.data;
}
