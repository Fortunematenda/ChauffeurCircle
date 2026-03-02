import { Router } from "express";

import { dashboard } from "../controllers/adminController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(requireRole("ADMIN"));

adminRouter.get("/dashboard", dashboard);
