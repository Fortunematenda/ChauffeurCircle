import { prisma } from "../db/prisma";

import { env } from "../config/env";
import { hashPassword } from "../services/passwordService";

type SeedUser = {
  phoneNumber: string;
  password: string;
  role: "DRIVER" | "CLIENT" | "ADMIN";
};

function readSeedUser(prefix: string, role: SeedUser["role"]): SeedUser | null {
  const phoneNumber = process.env[`${prefix}_PHONE`];
  const password = process.env[`${prefix}_PASSWORD`];

  if (!phoneNumber || !password) {
    return null;
  }

  const normalizedPhone = phoneNumber.trim();
  const trimmedPassword = password.trim();

  if (normalizedPhone.length === 0 || trimmedPassword.length < 8) {
    throw new Error(`Invalid ${prefix} credentials`);
  }

  return { phoneNumber: normalizedPhone, password: trimmedPassword, role };
}

async function createIfMissing(user: SeedUser) {
  const existing = await prisma.user.findUnique({
    where: { phoneNumber: user.phoneNumber },
    select: { id: true, phoneNumber: true, role: true },
  });

  if (existing) {
    console.log(`Seed skip: ${user.phoneNumber} already exists (${existing.role})`);
    return;
  }

  const passwordHash = await hashPassword(user.password);

  await prisma.user.create({
    data: {
      phoneNumber: user.phoneNumber,
      passwordHash,
      role: user.role,
    },
    select: { id: true },
  });

  console.log(`Seed created: ${user.phoneNumber} (${user.role})`);
}

async function main() {
  void env.DATABASE_URL;

  const admin = readSeedUser("SEED_ADMIN", "ADMIN");
  const driver = readSeedUser("SEED_DRIVER", "DRIVER");

  if (!admin && !driver) {
    console.log("No seed users configured. Set SEED_ADMIN_PHONE/SEED_ADMIN_PASSWORD and/or SEED_DRIVER_PHONE/SEED_DRIVER_PASSWORD.");
    return;
  }

  if (admin) {
    await createIfMissing(admin);
  }

  if (driver) {
    await createIfMissing(driver);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
