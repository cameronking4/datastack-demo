import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/backfill:
 *   post:
 *     summary: Backfill job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const { jobId } = await params;
  const body = (await request.json()) as {
    startDate?: string;
    endDate?: string;
    parallelism?: number;
  };

  return NextResponse.json(
    {
      backfillId: "bf-" + Date.now(),
      jobId,
      startDate: body.startDate ?? "2025-01-01",
      endDate: body.endDate ?? "2025-11-30",
      parallelism: body.parallelism ?? 4,
      status: "QUEUED",
      totalPartitions: 334,
      completedPartitions: 0,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
