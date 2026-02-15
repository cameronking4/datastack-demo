import { NextRequest, NextResponse } from "next/server";

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
