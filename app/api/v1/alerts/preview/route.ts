import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ALERTS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/alerts/preview:
 *   get:
 *     summary: Preview alert rule
 *     description: Evaluate whether a rule would trigger with current data
 *     parameters:
 *       - in: query
 *         name: ruleId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ALERTS_HEADER)) {
    return featureRequiredResponse(FEATURE_ALERTS_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const ruleId = searchParams.get("ruleId") ?? "alert-rule-001";

  return NextResponse.json({
    ruleId,
    evaluationResult: {
      wouldTrigger: true,
      currentValue: 0.08,
      threshold: 0.05,
      condition: "GREATER_THAN",
    },
    historicalTriggers: {
      last7Days: 3,
      last30Days: 7,
    },
    sampleData: [
      { timestamp: "2025-11-30T10:00:00Z", value: 0.03 },
      { timestamp: "2025-11-30T11:00:00Z", value: 0.04 },
      { timestamp: "2025-11-30T12:00:00Z", value: 0.06 },
      { timestamp: "2025-11-30T13:00:00Z", value: 0.08 },
    ],
    evaluatedAt: new Date().toISOString(),
  });
}
