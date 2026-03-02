import type { Request, Response } from "express";

import { acceptInviteByDriverPhone, listClientDrivers } from "../services/driverClientService";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function acceptInvite(req: Request, res: Response) {
  const { driverPhoneNumber } = (req.body ?? {}) as { driverPhoneNumber?: unknown };

  if (!isNonEmptyString(driverPhoneNumber)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const clientUserId = req.auth?.userId;
  if (!clientUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await acceptInviteByDriverPhone({ clientUserId, driverPhoneNumber });
    return res.status(200).json({ status: result.status });
  } catch (e) {
    if (e instanceof Error && e.message === "DRIVER_NOT_FOUND") {
      return res.status(404).json({ error: "Driver not found" });
    }

    if (e instanceof Error && e.message === "NOT_A_DRIVER") {
      return res.status(400).json({ error: "Invalid driver" });
    }

    if (e instanceof Error && e.message === "INVITE_NOT_FOUND") {
      return res.status(404).json({ error: "Invite not found" });
    }

    if (e instanceof Error && e.message === "INVITE_BLOCKED") {
      return res.status(409).json({ error: "Invite blocked" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getDrivers(req: Request, res: Response) {
  const clientUserId = req.auth?.userId;
  if (!clientUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const drivers = await listClientDrivers({ clientUserId });
  return res.json({ drivers });
}
