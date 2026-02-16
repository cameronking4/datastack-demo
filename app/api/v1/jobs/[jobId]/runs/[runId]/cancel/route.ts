import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * POST /api/v1/jobs/:jobId/runs/:runId/cancel
 * Cancel a running job run (preview only)
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
