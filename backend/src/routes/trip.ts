import { Router } from "express";

import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { end, getTrip, location, start } from "../controllers/tripController";

export const tripRouter = Router();

tripRouter.use(authenticate);

tripRouter.get("/:tripId", requireRole("DRIVER", "CLIENT", "ADMIN"), getTrip);

tripRouter.use(requireRole("DRIVER"));

tripRouter.post("/start", start);
tripRouter.post("/location", location);
tripRouter.post("/end", end);
