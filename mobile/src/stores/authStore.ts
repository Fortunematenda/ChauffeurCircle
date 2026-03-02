import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import * as authApi from "../api/authApi";
import { setAuthToken } from "../api/authToken";
import type { Role } from "../types/auth";

const TOKEN_KEY = "cc_auth_token";

type AuthState = {
  token: string | null;
  role: Role | null;
  phoneNumber: string | null;
  isBootstrapped: boolean;

  bootstrap: () => Promise<void>;
  login: (params: { phoneNumber: string; password: string }) => Promise<void>;
  register: (params: { phoneNumber: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  role: null,
  phoneNumber: null,
  isBootstrapped: false,

  bootstrap: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!token) {
      setAuthToken(null);
      set({ token: null, role: null, phoneNumber: null, isBootstrapped: true });
      return;
    }

    setAuthToken(token);
    set({ token });

    try {
      const { user } = await authApi.me();
      set({ role: user.role, phoneNumber: user.phoneNumber, isBootstrapped: true });
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthToken(null);
      set({ token: null, role: null, phoneNumber: null, isBootstrapped: true });
    }
  },

  login: async ({ phoneNumber, password }) => {
    const data = await authApi.login({ phoneNumber: phoneNumber.trim(), password: password.trim() });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setAuthToken(data.token);
    set({ token: data.token, role: data.user.role, phoneNumber: data.user.phoneNumber });
  },

  register: async ({ phoneNumber, password }) => {
    const data = await authApi.register({ phoneNumber: phoneNumber.trim(), password: password.trim() });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setAuthToken(data.token);
    set({ token: data.token, role: data.user.role, phoneNumber: data.user.phoneNumber });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthToken(null);
    set({ token: null, role: null, phoneNumber: null });
  },
}));
