import * as dashboardService from "../services/dashboardService.js";

export async function getDashboardSummary(req, res) {
  const summary = await dashboardService.getDashboardSummary(req.user.id);

  res.json({ data: summary });
}