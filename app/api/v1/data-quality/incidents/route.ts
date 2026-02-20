import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_QUALITY_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/data-quality/incidents:
 *   get:
 *     summary: List data quality incidents
 *     description: List open or resolved data quality incidents
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
  if (!isFeatureEnabled(request, FEATURE_DATA_QUALITY_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_QUALITY_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") ?? "OPEN";

  return NextResponse.json({
    incidents: [
      {
        incidentId: "inc-001",
        table: "catalog.schema.orders",
        rule: "Range Validation",
        severity: "HIGH",
        status,
        failedRecords: 42,
        detectedAt: "2025-11-30T14:30:00Z",
        resolvedAt: null,
      },
      {
        incidentId: "inc-002",
        table: "catalog.schema.users",
        rule: "Freshness Check",
        severity: "MEDIUM",
        status,
        failedRecords: 0,
        detectedAt: "2025-11-29T08:00:00Z",
        resolvedAt: null,
      },
    ],
    totalCount: 2,
  });
}
