import type { Request, Response } from "express";

import {
  createRideRequest,
  listClientRideRequests,
  listDriverRideRequests,
  respondToRideRequest,
} from "../services/rideRequestService";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export async function requestRide(req: Request, res: Response) {
  const clientUserId = req.auth?.userId;
  if (!clientUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  const driverPhoneNumber = body.driverPhoneNumber;
  const pickupAddress = body.pickupAddress;
  const pickupLat = body.pickupLat;
  const pickupLng = body.pickupLng;
  const dropoffAddress = body.dropoffAddress;
  const dropoffLat = body.dropoffLat;
  const dropoffLng = body.dropoffLng;
  const scheduledTime = body.scheduledTime;

  if (
    !isNonEmptyString(driverPhoneNumber) ||
    !isNonEmptyString(pickupAddress) ||
    !isFiniteNumber(pickupLat) ||
    !isFiniteNumber(pickupLng) ||
    !isNonEmptyString(dropoffAddress) ||
    !isFiniteNumber(dropoffLat) ||
    !isFiniteNumber(dropoffLng)
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let parsedScheduledTime: Date | undefined;
  if (scheduledTime !== undefined && scheduledTime !== null) {
    if (!isNonEmptyString(scheduledTime)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const d = new Date(scheduledTime);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid input" });
    }
    parsedScheduledTime = d;
  }

  try {
    const result = await createRideRequest({
      clientUserId,
      driverPhoneNumber,
      pickupAddress,
      pickupLat,
      pickupLng,
      dropoffAddress,
      dropoffLat,
      dropoffLng,
      scheduledTime: parsedScheduledTime,
    });

    return res.status(201).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "DRIVER_NOT_FOUND") {
      return res.status(404).json({ error: "Driver not found" });
    }

    if (e instanceof Error && e.message === "NOT_A_DRIVER") {
      return res.status(400).json({ error: "Invalid driver" });
    }

    if (e instanceof Error && e.message === "RELATIONSHIP_NOT_ACTIVE") {
      return res.status(403).json({ error: "Relationship not active" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function respond(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { rideRequestId, action } = (req.body ?? {}) as {
    rideRequestId?: unknown;
    action?: unknown;
  };

  if (!isNonEmptyString(rideRequestId) || (action !== "ACCEPT" && action !== "REJECT")) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await respondToRideRequest({
      driverUserId,
      rideRequestPublicId: rideRequestId,
      action,
    });

    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "RIDE_REQUEST_NOT_FOUND") {
      return res.status(404).json({ error: "Ride request not found" });
    }

    if (e instanceof Error && e.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (e instanceof Error && e.message === "INVALID_STATUS") {
      return res.status(409).json({ error: "Invalid status" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getDriverRides(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rides = await listDriverRideRequests({ driverUserId });
  return res.json({ rides });
}

export async function getClientRides(req: Request, res: Response) {
  const clientUserId = req.auth?.userId;
  if (!clientUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rides = await listClientRideRequests({ clientUserId });
  return res.json({ rides });
}
