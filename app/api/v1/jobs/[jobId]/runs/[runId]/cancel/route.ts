import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/runs/{runId}/cancel:
 *   post:
 *     summary: Cancel job run
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string; runId: string }> }
) {
  if (!isPreviewEnabled(request)) {
    return previewRequiredResponse();
  }

  const { jobId, runId } = await params;
  return NextResponse.json({
    runId: parseInt(runId, 10),
    jobId: parseInt(jobId, 10),
    state: "CANCELLING",
    cancelledAt: new Date().toISOString(),
    cancelledBy: "api",
  });
}
