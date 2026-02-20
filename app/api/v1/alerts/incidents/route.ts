import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ALERTS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/alerts/incidents:
 *   get:
 *     summary: List alert incidents
 *     parameters:
 *       - in: query
 *         name: status
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
  const status = searchParams.get("status") ?? "OPEN";

  return NextResponse.json({
    incidents: [
      {
        incidentId: "alert-inc-001",
        ruleId: "alert-rule-001",
        ruleName: "High Job Failure Rate",
        severity: "HIGH",
        status,
        triggeredValue: 0.12,
        threshold: 0.05,
        triggeredAt: "2025-11-30T14:30:00Z",
        acknowledgedAt: null,
        resolvedAt: null,
      },
      {
        incidentId: "alert-inc-002",
        ruleId: "alert-rule-002",
        ruleName: "Query Latency Spike",
        severity: "MEDIUM",
        status,
        triggeredValue: 15000,
        threshold: 10000,
        triggeredAt: "2025-11-30T16:00:00Z",
        acknowledgedAt: null,
        resolvedAt: null,
      },
    ],
    totalCount: 2,
  });
}
