import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_QUALITY_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/data-quality/monitors:
 *   post:
 *     summary: Create data quality monitor
 *     description: Create a monitor that runs quality rules on a schedule
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table:
 *                 type: string
 *               schedule:
 *                 type: string
 *               ruleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               alertOnFailure:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_DATA_QUALITY_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_QUALITY_HEADER);
  }

  const body = (await request.json()) as {
    table?: string;
    schedule?: string;
    ruleIds?: string[];
    alertOnFailure?: boolean;
  };

  return NextResponse.json(
    {
      monitorId: "mon-" + Date.now(),
      table: body.table ?? "catalog.schema.table",
      schedule: body.schedule ?? "0 */6 * * *",
      ruleIds: body.ruleIds ?? ["rule-001", "rule-002", "rule-003"],
      alertOnFailure: body.alertOnFailure ?? true,
      status: "ACTIVE",
      lastRunAt: null,
      nextRunAt: "2025-12-01T06:00:00Z",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
