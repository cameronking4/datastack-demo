import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/cost/analysis:
 *   get:
 *     summary: Get cost analysis
 *     description: Get cost breakdown by category for a period
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_COST_MANAGEMENT_HEADER)) {
    return featureRequiredResponse(FEATURE_COST_MANAGEMENT_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate") ?? "2025-11-01";
  const endDate = searchParams.get("endDate") ?? "2025-11-30";

  return NextResponse.json({
    period: { startDate, endDate },
    totalCost: 12450.75,
    currency: "USD",
    breakdown: [
      { category: "compute", cost: 8200.50, percentage: 65.9 },
      { category: "storage", cost: 2100.00, percentage: 16.9 },
      { category: "networking", cost: 1350.25, percentage: 10.8 },
      { category: "other", cost: 800.00, percentage: 6.4 },
    ],
    trend: "INCREASING",
    changeFromPriorPeriod: 8.5,
  });
}
