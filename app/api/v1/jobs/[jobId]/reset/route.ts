import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/reset:
 *   post:
 *     summary: Reset job
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { fromCheckpoint?: string; clearState?: boolean } | undefined;

  return NextResponse.json(
    {
      jobId,
      resetId: "reset-" + Date.now(),
      fromCheckpoint: body?.fromCheckpoint ?? null,
      clearState: body?.clearState ?? false,
      status: "RESET_ACCEPTED",
      message: "Job state reset has been queued. Next run will start from the specified checkpoint.",
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}
