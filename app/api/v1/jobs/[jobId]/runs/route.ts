import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled } from "@/lib/api/preview";

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
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const preview = isPreviewEnabled(request);
  const { jobId } = await params;
  const jobIdNum = parseInt(jobId, 10);

  let notebookParams: Record<string, string> = {};
  let idempotencyToken: string | undefined;
  let queueDuration: string | undefined;

  try {
    const body = (await request.json()) as {
      notebookParams?: Record<string, string>;
      idempotencyToken?: string;
      queueDuration?: string;
    };
    notebookParams = body.notebookParams ?? {};
    idempotencyToken = body.idempotencyToken;
    queueDuration = body.queueDuration;
  } catch {
    // no body provided
  }

  const response: Record<string, unknown> = {
    runId: 5001,
    jobId: jobIdNum,
    state: "PENDING",
    startTime: new Date().toISOString(),
    endTime: undefined,
    triggeredBy: "api",
  };

  if (preview) {
    response.notebookParams = notebookParams;
    if (idempotencyToken) response.idempotencyToken = idempotencyToken;
    if (queueDuration) response.queueDuration = queueDuration;
  }

  return NextResponse.json(response);
}
