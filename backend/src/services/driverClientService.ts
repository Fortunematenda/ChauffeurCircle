import { prisma } from "../db/prisma";

type DriverClientStatus = "PENDING" | "ACTIVE" | "BLOCKED";

type InviteResult =
  | { kind: "CREATED"; status: DriverClientStatus }
  | { kind: "EXISTS"; status: DriverClientStatus }
  | { kind: "BLOCKED"; status: DriverClientStatus };

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

export async function inviteClientByPhone(input: {
  driverUserId: string;
  clientPhoneNumber: string;
}): Promise<InviteResult> {
  const clientPhoneNumber = normalizePhoneNumber(input.clientPhoneNumber);

  const client = await prisma.user.findUnique({
    where: { phoneNumber: clientPhoneNumber },
    select: { id: true, role: true },
  });

  if (!client) {
    throw new Error("CLIENT_NOT_FOUND");
  }

  if (client.role !== "CLIENT") {
    throw new Error("NOT_A_CLIENT");
  }

  if (client.id === input.driverUserId) {
    throw new Error("INVALID_RELATIONSHIP");
  }

  const existing = await prisma.driverClient.findUnique({
    where: {
      driverId_clientId: {
        driverId: input.driverUserId,
        clientId: client.id,
      },
    },
    select: { status: true },
  });

  if (existing) {
    if (existing.status === "BLOCKED") {
      return { kind: "BLOCKED", status: existing.status };
    }

    return { kind: "EXISTS", status: existing.status };
  }

  const created = await prisma.driverClient.create({
    data: {
      driverId: input.driverUserId,
      clientId: client.id,
      status: "PENDING",
    },
    select: { status: true },
  });

  return { kind: "CREATED", status: created.status };
}

export async function acceptInviteByDriverPhone(input: {
  clientUserId: string;
  driverPhoneNumber: string;
}): Promise<{ status: DriverClientStatus }> {
  const driverPhoneNumber = normalizePhoneNumber(input.driverPhoneNumber);

  const driver = await prisma.user.findUnique({
    where: { phoneNumber: driverPhoneNumber },
    select: { id: true, role: true },
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
    select: { id: true, status: true },
  });

  if (!relation) {
    throw new Error("INVITE_NOT_FOUND");
  }

  if (relation.status === "BLOCKED") {
    throw new Error("INVITE_BLOCKED");
  }

  if (relation.status === "ACTIVE") {
    return { status: relation.status };
  }

  const updated = await prisma.driverClient.update({
    where: { id: relation.id },
    data: { status: "ACTIVE" },
    select: { status: true },
  });

  return { status: updated.status };
}

export async function listDriverClients(input: { driverUserId: string }): Promise<
  Array<{ clientPhoneNumber: string; status: DriverClientStatus; createdAt: Date }>
> {
  const rows = (await prisma.driverClient.findMany({
    where: { driverId: input.driverUserId },
    orderBy: { createdAt: "desc" },
    select: {
      status: true,
      createdAt: true,
      client: { select: { phoneNumber: true } },
    },
  })) as Array<{
    status: DriverClientStatus;
    createdAt: Date;
    client: { phoneNumber: string };
  }>;

  return rows.map((r) => ({
    clientPhoneNumber: r.client.phoneNumber,
    status: r.status,
    createdAt: r.createdAt,
  }));
}

export async function listClientDrivers(input: { clientUserId: string }): Promise<
  Array<{ driverPhoneNumber: string; status: DriverClientStatus; createdAt: Date }>
> {
  const rows = (await prisma.driverClient.findMany({
    where: { clientId: input.clientUserId },
    orderBy: { createdAt: "desc" },
    select: {
      status: true,
      createdAt: true,
      driver: { select: { phoneNumber: true } },
    },
  })) as Array<{
    status: DriverClientStatus;
    createdAt: Date;
    driver: { phoneNumber: string };
  }>;

  return rows.map((r) => ({
    driverPhoneNumber: r.driver.phoneNumber,
    status: r.status,
    createdAt: r.createdAt,
  }));
}
