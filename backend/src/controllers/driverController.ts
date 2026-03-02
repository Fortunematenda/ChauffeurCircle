import type { Request, Response } from "express";

import { inviteClientByPhone, listDriverClients } from "../services/driverClientService";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function inviteClient(req: Request, res: Response) {
  const { clientPhoneNumber } = (req.body ?? {}) as { clientPhoneNumber?: unknown };

  if (!isNonEmptyString(clientPhoneNumber)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await inviteClientByPhone({ driverUserId, clientPhoneNumber });

    if (result.kind === "BLOCKED") {
      return res.status(409).json({ error: "Client is blocked" });
    }

    return res.status(result.kind === "CREATED" ? 201 : 200).json({ status: result.status });
  } catch (e) {
    if (e instanceof Error && e.message === "CLIENT_NOT_FOUND") {
      return res.status(404).json({ error: "Client not found" });
    }

    if (e instanceof Error && e.message === "NOT_A_CLIENT") {
      return res.status(400).json({ error: "Invalid client" });
    }

    if (e instanceof Error && e.message === "INVALID_RELATIONSHIP") {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getClients(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const clients = await listDriverClients({ driverUserId });
  return res.json({ clients });
}
