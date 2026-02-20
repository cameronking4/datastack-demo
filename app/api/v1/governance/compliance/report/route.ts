import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_GOVERNANCE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/governance/compliance/report:
 *   post:
 *     summary: Generate compliance report
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               framework:
 *                 type: string
 *               scope:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_GOVERNANCE_HEADER)) {
    return featureRequiredResponse(FEATURE_GOVERNANCE_HEADER);
  }

  const body = (await request.json()) as {
    framework?: string;
    scope?: string;
  };

  return NextResponse.json(
    {
      reportId: "comp-" + Date.now(),
      framework: body.framework ?? "SOC2",
      scope: body.scope ?? "workspace",
      overallScore: 87.5,
      controls: [
        { id: "CC6.1", name: "Logical Access", status: "COMPLIANT", score: 95 },
        { id: "CC6.2", name: "Authentication", status: "COMPLIANT", score: 90 },
        { id: "CC6.3", name: "Authorization", status: "PARTIAL", score: 75 },
        { id: "CC7.1", name: "Monitoring", status: "COMPLIANT", score: 88 },
      ],
      generatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
