import * as dashboardRepository from "../repositories/dashboardRepository.js";

export async function getDashboardSummary(userId) {
  return await dashboardRepository.getDashboardSummary(userId);
}