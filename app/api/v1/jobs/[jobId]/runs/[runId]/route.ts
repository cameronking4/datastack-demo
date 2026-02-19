import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/runs/{runId}:
 *   get:
 *     summary: Get job run status
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/jobs/:jobId/runs/:runId
 * Get job run status
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string; runId: string }> }
) {
  const { jobId, runId } = await params;
  return NextResponse.json({
    runId: parseInt(runId, 10),
    jobId: parseInt(jobId, 10),
    state: "SUCCESS",
    startTime: "2024-03-10T02:00:01Z",
    endTime: "2024-03-10T02:15:33Z",
    triggeredBy: "schedule",
  });
}
