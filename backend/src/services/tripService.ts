import { prisma } from "../db/prisma";

type TripStatus = "ONGOING" | "COMPLETED";

type RideRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

type Role = "DRIVER" | "CLIENT" | "ADMIN";

export async function startTrip(input: {
  driverUserId: string;
  rideRequestPublicId: string;
}): Promise<{ tripId: string; status: TripStatus }> {
  const rideRequest = await prisma.rideRequest.findUnique({
    where: { publicId: input.rideRequestPublicId },
    select: {
      id: true,
      status: true,
      driverId: true,
      trip: { select: { publicId: true, status: true } },
    },
  });

  if (!rideRequest) {
    throw new Error("RIDE_REQUEST_NOT_FOUND");
  }

  if (rideRequest.driverId !== input.driverUserId) {
    throw new Error("FORBIDDEN");
  }

  if ((rideRequest.status as RideRequestStatus) !== "ACCEPTED") {
    throw new Error("INVALID_RIDE_REQUEST_STATUS");
  }

  if (rideRequest.trip) {
    throw new Error("TRIP_ALREADY_EXISTS");
  }

  const trip = await prisma.trip.create({
    data: {
      rideRequestId: rideRequest.id,
      status: "ONGOING",
    },
    select: { publicId: true, status: true },
  });

  return { tripId: trip.publicId, status: trip.status as TripStatus };
}

export async function addTripLocation(input: {
  driverUserId: string;
  tripPublicId: string;
  latitude: number;
  longitude: number;
  timestamp?: Date;
}): Promise<void> {
  const trip = await prisma.trip.findUnique({
    where: { publicId: input.tripPublicId },
    select: {
      id: true,
      status: true,
      rideRequest: { select: { driverId: true } },
    },
  });

  if (!trip) {
    throw new Error("TRIP_NOT_FOUND");
  }

  if (trip.rideRequest.driverId !== input.driverUserId) {
    throw new Error("FORBIDDEN");
  }

  if ((trip.status as TripStatus) !== "ONGOING") {
    throw new Error("INVALID_TRIP_STATUS");
  }

  await prisma.location.create({
    data: {
      tripId: trip.id,
      latitude: input.latitude,
      longitude: input.longitude,
      ...(input.timestamp ? { timestamp: input.timestamp } : {}),
    },
  });
}

export async function endTrip(input: {
  driverUserId: string;
  tripPublicId: string;
  fare?: number;
}): Promise<{ status: TripStatus }> {
  const trip = await prisma.trip.findUnique({
    where: { publicId: input.tripPublicId },
    select: {
      id: true,
      status: true,
      rideRequest: { select: { driverId: true } },
    },
  });

  if (!trip) {
    throw new Error("TRIP_NOT_FOUND");
  }

  if (trip.rideRequest.driverId !== input.driverUserId) {
    throw new Error("FORBIDDEN");
  }

  if ((trip.status as TripStatus) !== "ONGOING") {
    throw new Error("INVALID_TRIP_STATUS");
  }

  const updated = await prisma.trip.update({
    where: { id: trip.id },
    data: {
      status: "COMPLETED",
      endTime: new Date(),
      ...(input.fare !== undefined ? { fare: input.fare } : {}),
    },
    select: { status: true },
  });

  return { status: updated.status as TripStatus };
}

export async function getTripDetails(input: {
  requesterUserId: string;
  requesterRole: Role;
  tripPublicId: string;
}): Promise<{
  trip: {
    tripId: string;
    status: TripStatus;
    startTime: Date;
    endTime: Date | null;
    fare: number | null;
    rideRequestId: string;
    rideRequestStatus: RideRequestStatus;
    driverPhoneNumber: string;
    clientPhoneNumber: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    latestLocation: { latitude: number; longitude: number; timestamp: Date } | null;
  };
}> {
  const trip = await prisma.trip.findUnique({
    where: { publicId: input.tripPublicId },
    select: {
      publicId: true,
      status: true,
      startTime: true,
      endTime: true,
      fare: true,
      rideRequest: {
        select: {
          publicId: true,
          status: true,
          driverId: true,
          clientId: true,
          pickupAddress: true,
          pickupLat: true,
          pickupLng: true,
          dropoffAddress: true,
          dropoffLat: true,
          dropoffLng: true,
          driver: { select: { phoneNumber: true } },
          client: { select: { phoneNumber: true } },
        },
      },
      locations: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: { latitude: true, longitude: true, timestamp: true },
      },
    },
  });

  if (!trip) {
    throw new Error("TRIP_NOT_FOUND");
  }

  const isAdmin = input.requesterRole === "ADMIN";
  const isDriver = trip.rideRequest.driverId === input.requesterUserId;
  const isClient = trip.rideRequest.clientId === input.requesterUserId;
  if (!isAdmin && !isDriver && !isClient) {
    throw new Error("FORBIDDEN");
  }

  const latest = trip.locations[0] ?? null;

  return {
    trip: {
      tripId: trip.publicId,
      status: trip.status as TripStatus,
      startTime: trip.startTime,
      endTime: trip.endTime,
      fare: trip.fare ?? null,
      rideRequestId: trip.rideRequest.publicId,
      rideRequestStatus: trip.rideRequest.status as RideRequestStatus,
      driverPhoneNumber: trip.rideRequest.driver.phoneNumber,
      clientPhoneNumber: trip.rideRequest.client.phoneNumber,
      pickupAddress: trip.rideRequest.pickupAddress,
      pickupLat: trip.rideRequest.pickupLat,
      pickupLng: trip.rideRequest.pickupLng,
      dropoffAddress: trip.rideRequest.dropoffAddress,
      dropoffLat: trip.rideRequest.dropoffLat,
      dropoffLng: trip.rideRequest.dropoffLng,
      latestLocation: latest
        ? { latitude: latest.latitude, longitude: latest.longitude, timestamp: latest.timestamp }
        : null,
    },
  };
}
