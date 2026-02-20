import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/cost/forecast:
 *   get:
 *     summary: Get cost forecast
 *     description: Get projected cost over a horizon
 *     parameters:
 *       - in: query
 *         name: horizon
 *         schema:
 *           type: string
 *         description: Forecast horizon in days
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_COST_MANAGEMENT_HEADER)) {
    return featureRequiredResponse(FEATURE_COST_MANAGEMENT_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const horizon = searchParams.get("horizon") ?? "30";

  return NextResponse.json({
    forecastHorizonDays: parseInt(horizon, 10),
    projectedCost: 13800.00,
    confidence: 0.85,
    currency: "USD",
    dailyForecast: [
      { date: "2025-12-01", projected: 420.50, lower: 380.00, upper: 460.00 },
      { date: "2025-12-02", projected: 435.00, lower: 390.00, upper: 480.00 },
      { date: "2025-12-03", projected: 410.25, lower: 370.00, upper: 450.00 },
    ],
    generatedAt: new Date().toISOString(),
  });
}
