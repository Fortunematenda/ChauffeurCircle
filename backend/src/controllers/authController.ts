import type { Request, Response } from "express";

import { loginUser, registerUser } from "../services/authService";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

export async function register(req: Request, res: Response) {
  const { phoneNumber, password, role } = (req.body ?? {}) as {
    phoneNumber?: unknown;
    password?: unknown;
    role?: unknown;
  };

  if (!isNonEmptyString(phoneNumber) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (role !== undefined && role !== "CLIENT") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await registerUser({
      phoneNumber: normalizedPhoneNumber,
      password,
      role: "CLIENT",
    });

    return res.status(201).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "PHONE_ALREADY_REGISTERED") {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  const { phoneNumber, password } = (req.body ?? {}) as {
    phoneNumber?: unknown;
    password?: unknown;
  };

  if (!isNonEmptyString(phoneNumber) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  try {
    const result = await loginUser({
      phoneNumber: normalizedPhoneNumber,
      password,
    });

    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
