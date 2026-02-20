import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/jobs/conditional-trigger:
 *   post:
 *     summary: Conditional trigger
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const body = (await request.json()) as {
    jobId?: string;
    conditions?: { type: string; expression: string }[];
    action?: string;
  };

  return NextResponse.json(
    {
      triggerId: "trigger-" + Date.now(),
      jobId: body.jobId ?? "job-1001",
      conditions: body.conditions ?? [
        { type: "DATA_ARRIVAL", expression: "catalog.schema.table.partition_date = TODAY()" },
      ],
      action: body.action ?? "RUN",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
