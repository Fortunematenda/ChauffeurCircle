import type { Request, Response } from "express";

import { getAdminDashboard } from "../services/adminService";

export async function dashboard(_req: Request, res: Response) {
  const data = await getAdminDashboard();
  return res.json(data);
}
