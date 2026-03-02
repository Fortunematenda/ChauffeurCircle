import { apiClient } from "./apiClient";
import type { AuthResponse, AuthUser } from "../types/auth";

export async function register(params: { phoneNumber: string; password: string }): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/register", params);
  return res.data;
}

export async function login(params: { phoneNumber: string; password: string }): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/login", params);
  return res.data;
}

export async function me(): Promise<{ user: AuthUser }> {
  const res = await apiClient.get<{ user: AuthUser }>("/auth/me");
  return res.data;
}
