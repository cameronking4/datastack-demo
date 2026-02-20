import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_GOVERNANCE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/governance/access-requests:
 *   get:
 *     summary: List access requests
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
  if (!isFeatureEnabled(request, FEATURE_GOVERNANCE_HEADER)) {
    return featureRequiredResponse(FEATURE_GOVERNANCE_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") ?? "PENDING";

  return NextResponse.json({
    requests: [
      {
        requestId: "ar-001",
        requester: "analyst@datastack.dev",
        resource: "catalog.schema.financial_data",
        permissions: ["SELECT"],
        justification: "Need access for quarterly report",
        status,
        requestedAt: "2025-11-30T09:00:00Z",
        reviewedBy: null,
      },
      {
        requestId: "ar-002",
        requester: "engineer@datastack.dev",
        resource: "catalog.schema.pii_table",
        permissions: ["SELECT", "MODIFY"],
        justification: "Data migration project",
        status,
        requestedAt: "2025-11-29T16:00:00Z",
        reviewedBy: null,
      },
    ],
    totalCount: 2,
  });
}
