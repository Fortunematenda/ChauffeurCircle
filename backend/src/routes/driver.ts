import { Router } from "express";

import { inviteClient, getClients } from "../controllers/driverController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

export const driverRouter = Router();

driverRouter.use(authenticate);
driverRouter.use(requireRole("DRIVER"));

driverRouter.post("/invite", inviteClient);
driverRouter.get("/clients", getClients);
