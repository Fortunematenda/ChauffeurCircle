import { prisma } from "../db/prisma";

type RideRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

type TripStatus = "ONGOING" | "COMPLETED";

type CreateRideRequestInput = {
  clientUserId: string;
  driverPhoneNumber: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  scheduledTime?: Date;
};

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

export async function createRideRequest(input: CreateRideRequestInput): Promise<{ publicId: string; status: RideRequestStatus }> {
  const driverPhoneNumber = normalizePhoneNumber(input.driverPhoneNumber);

  const driver = await prisma.user.findUnique({
    where: { phoneNumber: driverPhoneNumber },
    select: { id: true, role: true, phoneNumber: true },
  });

  if (!driver) {
    throw new Error("DRIVER_NOT_FOUND");
  }

  if (driver.role !== "DRIVER") {
    throw new Error("NOT_A_DRIVER");
  }

  const relation = await prisma.driverClient.findUnique({
    where: {
      driverId_clientId: {
        driverId: driver.id,
        clientId: input.clientUserId,
      },
    },
    select: { status: true },
  });

  if (!relation || relation.status !== "ACTIVE") {
    throw new Error("RELATIONSHIP_NOT_ACTIVE");
  }

  const rideRequest = await prisma.rideRequest.create({
    data: {
      driverId: driver.id,
      clientId: input.clientUserId,
      pickupAddress: input.pickupAddress,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
      dropoffAddress: input.dropoffAddress,
      dropoffLat: input.dropoffLat,
      dropoffLng: input.dropoffLng,
      scheduledTime: input.scheduledTime,
      status: "PENDING",
    },
    select: { publicId: true, status: true },
  });

  return { publicId: rideRequest.publicId, status: rideRequest.status as RideRequestStatus };
}

export async function respondToRideRequest(input: {
  driverUserId: string;
  rideRequestPublicId: string;
  action: "ACCEPT" | "REJECT";
}): Promise<{ status: RideRequestStatus }> {
  const rideRequest = await prisma.rideRequest.findUnique({
    where: { publicId: input.rideRequestPublicId },
    select: { id: true, status: true, driverId: true },
  });

  if (!rideRequest) {
    throw new Error("RIDE_REQUEST_NOT_FOUND");
  }

  if (rideRequest.driverId !== input.driverUserId) {
    throw new Error("FORBIDDEN");
  }

  if (rideRequest.status !== "PENDING") {
    throw new Error("INVALID_STATUS");
  }

  const newStatus: RideRequestStatus = input.action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

  const updated = await prisma.rideRequest.update({
    where: { id: rideRequest.id },
    data: { status: newStatus },
    select: { status: true },
  });

  return { status: updated.status as RideRequestStatus };
}

export async function listDriverRideRequests(input: { driverUserId: string }): Promise<
  Array<{
    publicId: string;
    status: RideRequestStatus;
    createdAt: Date;
    scheduledTime: Date | null;
    tripId: string | null;
    tripStatus: TripStatus | null;
    clientPhoneNumber: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
  }>
> {
  const rows = (await prisma.rideRequest.findMany({
    where: { driverId: input.driverUserId },
    orderBy: { createdAt: "desc" },
    select: {
      publicId: true,
      status: true,
      createdAt: true,
      scheduledTime: true,
      pickupAddress: true,
      pickupLat: true,
      pickupLng: true,
      dropoffAddress: true,
      dropoffLat: true,
      dropoffLng: true,
      client: { select: { phoneNumber: true } },
      trip: { select: { publicId: true, status: true } },
    },
  })) as Array<{
    publicId: string;
    status: RideRequestStatus;
    createdAt: Date;
    scheduledTime: Date | null;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    client: { phoneNumber: string };
    trip: { publicId: string; status: TripStatus } | null;
  }>;

  return rows.map((r) => ({
    publicId: r.publicId,
    status: r.status,
    createdAt: r.createdAt,
    scheduledTime: r.scheduledTime,
    tripId: r.trip?.publicId ?? null,
    tripStatus: r.trip?.status ?? null,
    clientPhoneNumber: r.client.phoneNumber,
    pickupAddress: r.pickupAddress,
    pickupLat: r.pickupLat,
    pickupLng: r.pickupLng,
    dropoffAddress: r.dropoffAddress,
    dropoffLat: r.dropoffLat,
    dropoffLng: r.dropoffLng,
  }));
}

export async function listClientRideRequests(input: { clientUserId: string }): Promise<
  Array<{
    publicId: string;
    status: RideRequestStatus;
    createdAt: Date;
    scheduledTime: Date | null;
    tripId: string | null;
    tripStatus: TripStatus | null;
    driverPhoneNumber: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
  }>
> {
  const rows = (await prisma.rideRequest.findMany({
    where: { clientId: input.clientUserId },
    orderBy: { createdAt: "desc" },
    select: {
      publicId: true,
      status: true,
      createdAt: true,
      scheduledTime: true,
      pickupAddress: true,
      pickupLat: true,
      pickupLng: true,
      dropoffAddress: true,
      dropoffLat: true,
      dropoffLng: true,
      driver: { select: { phoneNumber: true } },
      trip: { select: { publicId: true, status: true } },
    },
  })) as Array<{
    publicId: string;
    status: RideRequestStatus;
    createdAt: Date;
    scheduledTime: Date | null;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    driver: { phoneNumber: string };
    trip: { publicId: string; status: TripStatus } | null;
  }>;

  return rows.map((r) => ({
    publicId: r.publicId,
    status: r.status,
    createdAt: r.createdAt,
    scheduledTime: r.scheduledTime,
    tripId: r.trip?.publicId ?? null,
    tripStatus: r.trip?.status ?? null,
    driverPhoneNumber: r.driver.phoneNumber,
    pickupAddress: r.pickupAddress,
    pickupLat: r.pickupLat,
    pickupLng: r.pickupLng,
    dropoffAddress: r.dropoffAddress,
    dropoffLat: r.dropoffLat,
    dropoffLng: r.dropoffLng,
  }));
}
