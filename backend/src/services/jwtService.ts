import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export type Role = "DRIVER" | "CLIENT" | "ADMIN";

const roleValues: Role[] = ["DRIVER", "CLIENT", "ADMIN"];

export type AuthTokenPayload = {
  sub: string;
  role: Role;
};

export function signAuthToken(userId: string, role: Role): string {
  const secret: Secret = env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  return jwt.sign({ role }, secret, {
    subject: userId,
    expiresIn,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const secret: Secret = env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token");
  }

  const payload = decoded as { sub?: unknown; role?: unknown };

  if (typeof payload.sub !== "string" || typeof payload.role !== "string") {
    throw new Error("Invalid token");
  }

  if (!roleValues.includes(payload.role as Role)) {
    throw new Error("Invalid token");
  }

  return { sub: payload.sub, role: payload.role as Role };
}
