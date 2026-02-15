import { NextRequest, NextResponse } from "next/server";

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
