import { prisma } from "../db/prisma";
import { hashPassword, verifyPassword } from "./passwordService";
import { signAuthToken } from "./jwtService";

export async function registerUser(input: {
  phoneNumber: string;
  password: string;
  role: "DRIVER" | "CLIENT";
}): Promise<{ token: string; user: { phoneNumber: string; role: string } }> {
  const existing = await prisma.user.findUnique({ where: { phoneNumber: input.phoneNumber } });
  if (existing) {
    throw new Error("PHONE_ALREADY_REGISTERED");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      phoneNumber: input.phoneNumber,
      passwordHash,
      role: input.role,
    },
    select: {
      id: true,
      phoneNumber: true,
      role: true,
    },
  });

  const token = signAuthToken(user.id, user.role as "DRIVER" | "CLIENT" | "ADMIN");

  return { token, user: { phoneNumber: user.phoneNumber, role: user.role } };
}

export async function loginUser(input: {
  phoneNumber: string;
  password: string;
}): Promise<{ token: string; user: { phoneNumber: string; role: string } }> {
  const user = await prisma.user.findUnique({
    where: { phoneNumber: input.phoneNumber },
    select: {
      id: true,
      phoneNumber: true,
      passwordHash: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = signAuthToken(user.id, user.role as "DRIVER" | "CLIENT" | "ADMIN");

  return { token, user: { phoneNumber: user.phoneNumber, role: user.role } };
}
