import type { Request, Response } from "express";

import { addTripLocation, endTrip, getTripDetails, startTrip } from "../services/tripService";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export async function getTrip(req: Request, res: Response) {
  const requesterUserId = req.auth?.userId;
  const requesterRole = req.auth?.role;
  if (!requesterUserId || !requesterRole) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tripId = req.params.tripId;
  if (!isNonEmptyString(tripId)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await getTripDetails({
      requesterUserId,
      requesterRole,
      tripPublicId: tripId,
    });

    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "TRIP_NOT_FOUND") {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (e instanceof Error && e.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function start(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { rideRequestId } = (req.body ?? {}) as { rideRequestId?: unknown };

  if (!isNonEmptyString(rideRequestId)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await startTrip({ driverUserId, rideRequestPublicId: rideRequestId });
    return res.status(201).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "RIDE_REQUEST_NOT_FOUND") {
      return res.status(404).json({ error: "Ride request not found" });
    }

    if (e instanceof Error && e.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (e instanceof Error && e.message === "INVALID_RIDE_REQUEST_STATUS") {
      return res.status(409).json({ error: "Invalid status" });
    }

    if (e instanceof Error && e.message === "TRIP_ALREADY_EXISTS") {
      return res.status(409).json({ error: "Trip already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function location(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { tripId, latitude, longitude, timestamp } = (req.body ?? {}) as {
    tripId?: unknown;
    latitude?: unknown;
    longitude?: unknown;
    timestamp?: unknown;
  };

  if (!isNonEmptyString(tripId) || !isFiniteNumber(latitude) || !isFiniteNumber(longitude)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let parsedTimestamp: Date | undefined;
  if (timestamp !== undefined && timestamp !== null) {
    if (!isNonEmptyString(timestamp)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid input" });
    }
    parsedTimestamp = d;
  }

  try {
    await addTripLocation({
      driverUserId,
      tripPublicId: tripId,
      latitude,
      longitude,
      timestamp: parsedTimestamp,
    });

    return res.status(204).send();
  } catch (e) {
    if (e instanceof Error && e.message === "TRIP_NOT_FOUND") {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (e instanceof Error && e.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (e instanceof Error && e.message === "INVALID_TRIP_STATUS") {
      return res.status(409).json({ error: "Invalid status" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function end(req: Request, res: Response) {
  const driverUserId = req.auth?.userId;
  if (!driverUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { tripId, fare } = (req.body ?? {}) as { tripId?: unknown; fare?: unknown };

  if (!isNonEmptyString(tripId)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (fare !== undefined && fare !== null && !isFiniteNumber(fare)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (isFiniteNumber(fare) && fare < 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await endTrip({
      driverUserId,
      tripPublicId: tripId,
      fare: isFiniteNumber(fare) ? fare : undefined,
    });

    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "TRIP_NOT_FOUND") {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (e instanceof Error && e.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (e instanceof Error && e.message === "INVALID_TRIP_STATUS") {
      return res.status(409).json({ error: "Invalid status" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
