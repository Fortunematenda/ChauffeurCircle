import { Router } from "express";

import { acceptInvite, getDrivers } from "../controllers/clientController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

export const clientRouter = Router();

clientRouter.use(authenticate);
clientRouter.use(requireRole("CLIENT"));

clientRouter.post("/accept-invite", acceptInvite);
clientRouter.get("/drivers", getDrivers);
