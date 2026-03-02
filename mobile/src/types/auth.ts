export type Role = "DRIVER" | "CLIENT" | "ADMIN";

export type AuthUser = {
  phoneNumber: string;
  role: Role;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: {
    phoneNumber: string;
    role: Role;
  };
};
