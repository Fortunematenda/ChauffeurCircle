import { Router } from "express";

import { login, register } from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import { prisma } from "../db/prisma";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", authenticate, async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phoneNumber: true, role: true, createdAt: true },
  });

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json({ user });
});
