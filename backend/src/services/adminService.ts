import { prisma } from "../db/prisma";

type Role = "DRIVER" | "CLIENT" | "ADMIN";

type DriverClientStatus = "PENDING" | "ACTIVE" | "BLOCKED";

type RideRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

type TripStatus = "ONGOING" | "COMPLETED";

export type AdminDashboard = {
  users: {
    total: number;
    byRole: Record<Role, number>;
  };
  relationships: {
    total: number;
    byStatus: Record<DriverClientStatus, number>;
  };
  rideRequests: {
    total: number;
    byStatus: Record<RideRequestStatus, number>;
  };
  trips: {
    total: number;
    byStatus: Record<TripStatus, number>;
    completed: {
      withFareCount: number;
      fareSum: number;
    };
  };
};

function toCountRecord<T extends string>(keys: readonly T[], rows: Array<{ key: string; count: number }>): Record<T, number> {
  const out = Object.fromEntries(keys.map((k) => [k, 0])) as Record<T, number>;
  for (const r of rows) {
    const k = r.key as T;
    if (k in out) {
      out[k] = r.count;
    }
  }
  return out;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const roleKeys = ["DRIVER", "CLIENT", "ADMIN"] as const;
  const driverClientStatusKeys = ["PENDING", "ACTIVE", "BLOCKED"] as const;
  const rideRequestStatusKeys = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"] as const;
  const tripStatusKeys = ["ONGOING", "COMPLETED"] as const;

  const [
    usersTotal,
    usersByRoleRows,
    relationshipsTotal,
    relationshipsByStatusRows,
    rideRequestsTotal,
    rideRequestsByStatusRows,
    tripsTotal,
    tripsByStatusRows,
    completedWithFareCount,
    completedFareSum,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
    prisma.driverClient.count(),
    prisma.driverClient.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.rideRequest.count(),
    prisma.rideRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.trip.count(),
    prisma.trip.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.trip.count({ where: { status: "COMPLETED", fare: { not: null } } }),
    prisma.trip.aggregate({
      where: { status: "COMPLETED" },
      _sum: { fare: true },
    }),
  ]);

  const usersByRole = toCountRecord<Role>(
    roleKeys,
    (usersByRoleRows as Array<{ role: Role; _count: { _all: number } }>).map((r) => ({
      key: r.role,
      count: r._count._all,
    }))
  );
  const relationshipsByStatus = toCountRecord<DriverClientStatus>(
    driverClientStatusKeys,
    (relationshipsByStatusRows as Array<{ status: DriverClientStatus; _count: { _all: number } }>).map((r) => ({
      key: r.status,
      count: r._count._all,
    }))
  );
  const rideRequestsByStatus = toCountRecord<RideRequestStatus>(
    rideRequestStatusKeys,
    (rideRequestsByStatusRows as Array<{ status: RideRequestStatus; _count: { _all: number } }>).map((r) => ({
      key: r.status,
      count: r._count._all,
    }))
  );
  const tripsByStatus = toCountRecord<TripStatus>(
    tripStatusKeys,
    (tripsByStatusRows as Array<{ status: TripStatus; _count: { _all: number } }>).map((r) => ({
      key: r.status,
      count: r._count._all,
    }))
  );

  return {
    users: {
      total: usersTotal,
      byRole: usersByRole,
    },
    relationships: {
      total: relationshipsTotal,
      byStatus: relationshipsByStatus,
    },
    rideRequests: {
      total: rideRequestsTotal,
      byStatus: rideRequestsByStatus,
    },
    trips: {
      total: tripsTotal,
      byStatus: tripsByStatus,
      completed: {
        withFareCount: completedWithFareCount,
        fareSum: completedFareSum._sum.fare ?? 0,
      },
    },
  };
}
