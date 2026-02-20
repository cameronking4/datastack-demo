import { NextRequest, NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_OBSERVABILITY_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/run-metrics:
 *   get:
 *     summary: List run metrics
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *       - in: query
 *         name: runId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_OBSERVABILITY_HEADER)) {
    return featureRequiredResponse(FEATURE_OBSERVABILITY_HEADER);
  }
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get("jobId");
  const runId = searchParams.get("runId");
  const from = searchParams.get("from") ?? new Date(Date.now() - 86400000 * 7).toISOString();
  const to = searchParams.get("to") ?? new Date().toISOString();
  const requestId = getRequestId(request);

  const metrics = [
    {
      runId: runId ?? "run-100",
      jobId: jobId ?? "1001",
      startedAt: "2024-06-10T02:00:00Z",
      endedAt: "2024-06-10T02:45:00Z",
      status: "SUCCESS",
      durationMs: 2700000,
      cpuSeconds: 4200,
      memoryPeakMb: 8192,
      taskCount: 150,
      completedTaskCount: 150,
      failedTaskCount: 0,
      bytesRead: 10737418240,
      bytesWritten: 2147483648,
    },
    {
      runId: "run-099",
      jobId: jobId ?? "1001",
      startedAt: "2024-06-09T02:00:00Z",
      endedAt: "2024-06-09T02:42:00Z",
      status: "SUCCESS",
      durationMs: 2520000,
      cpuSeconds: 3900,
      memoryPeakMb: 7680,
      taskCount: 148,
      completedTaskCount: 148,
      failedTaskCount: 0,
      bytesRead: 9663676416,
      bytesWritten: 1932735283,
    },
  ];

  return NextResponse.json(
    {
      metrics,
      period: { from, to },
      requestId,
    },
    {
      headers: { "x-request-id": requestId },
    }
  );
}
