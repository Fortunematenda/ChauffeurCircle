import { Router } from "express";

import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { getClientRides, getDriverRides, requestRide, respond } from "../controllers/ridesController";

export const ridesRouter = Router();

ridesRouter.post("/request", authenticate, requireRole("CLIENT"), requestRide);
ridesRouter.post("/respond", authenticate, requireRole("DRIVER"), respond);

ridesRouter.get("/driver", authenticate, requireRole("DRIVER"), getDriverRides);
ridesRouter.get("/client", authenticate, requireRole("CLIENT"), getClientRides);
