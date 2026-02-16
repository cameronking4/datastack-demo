import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/runs:
 *   post:
 *     summary: Trigger job run
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/jobs/:jobId/runs
 * Trigger job run immediately
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const jobIdNum = parseInt(jobId, 10);
  return NextResponse.json({
    runId: 5001,
    jobId: jobIdNum,
    state: "PENDING",
    startTime: new Date().toISOString(),
    endTime: undefined,
    triggeredBy: "api",
  });
}
