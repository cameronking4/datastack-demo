import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_OBSERVABILITY_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/run-metrics/{runId}:
 *   get:
 *     summary: Get run metrics
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_OBSERVABILITY_HEADER)) {
    return featureRequiredResponse(FEATURE_OBSERVABILITY_HEADER);
  }
  const { runId } = await params;
  const requestId = getRequestId(request);

  return NextResponse.json({
    runId,
    jobId: "1001",
    jobName: "Daily ETL",
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
    stages: [
      { stageId: "s-1", name: "Ingest", durationMs: 600000, numTasks: 50, bytesRead: 5368709120, bytesWritten: 1073741824 },
      { stageId: "s-2", name: "Transform", durationMs: 1800000, numTasks: 80, bytesRead: 5368709120, bytesWritten: 1073741824 },
      { stageId: "s-3", name: "Write", durationMs: 300000, numTasks: 20, bytesRead: 0, bytesWritten: 0 },
    ],
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
