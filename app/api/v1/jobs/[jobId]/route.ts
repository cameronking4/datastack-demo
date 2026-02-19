import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/jobs/{jobId}:
 *   get:
 *     summary: Get job
 *     description: Get job configuration, schedule, and recent run history
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update job
 *     description: Update job configuration, schedule, or retry policy
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               schedule:
 *                 type: string
 *               timezone:
 *                 type: string
 *               triggerType:
 *                 type: string
 *                 enum: [PERIODIC, CONTINUOUS, ONE_TIME, FILE_ARRIVAL, TABLE_UPDATE]
 *               maxConcurrentRuns:
 *                 type: integer
 *               retryPolicy:
 *                 type: object
 *                 properties:
 *                   maxRetries:
 *                     type: integer
 *                   retryIntervalSeconds:
 *                     type: integer
 *                   retryOnTimeout:
 *                     type: boolean
 *               alertDestinations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     destination:
 *                       type: string
 *               settings:
 *                 type: object
 *                 properties:
 *                   clusterId:
 *                     type: string
 *                   notebookPath:
 *                     type: string
 *                   timeoutSeconds:
 *                     type: integer
 *               state:
 *                 type: string
 *                 enum: [ACTIVE, PAUSED, DISABLED]
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete job
 *     description: Permanently delete a job and its run history
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  return NextResponse.json({
    jobId: parseInt(jobId, 10) || jobId,
    name: "Daily ETL",
    description: "Ingest and transform raw events",
    schedule: "0 0 2 * * ?",
    timezone: "UTC",
    triggerType: "PERIODIC",
    maxConcurrentRuns: 1,
    retryPolicy: {
      maxRetries: 3,
      retryIntervalSeconds: 600,
      retryOnTimeout: true,
    },
    alertDestinations: [
      { type: "EMAIL", destination: "team@datastack.dev", onStart: false, onSuccess: false, onFailure: true },
    ],
    settings: {
      clusterId: "cluster-001",
      notebookPath: "/Workspace/ETL/daily_pipeline",
      timeoutSeconds: 3600,
    },
    state: "ACTIVE",
    tags: { team: "data-eng", priority: "high" },
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-05T14:00:00Z",
    createdBy: "ada@datastack.dev",
    lastRunAt: "2024-06-10T02:00:00Z",
    lastRunStatus: "SUCCESS",
    nextRunAt: "2024-06-11T02:00:00Z",
    recentRuns: [
      { runId: "run-100", status: "SUCCESS", startedAt: "2024-06-10T02:00:00Z", endedAt: "2024-06-10T02:45:00Z" },
      { runId: "run-099", status: "SUCCESS", startedAt: "2024-06-09T02:00:00Z", endedAt: "2024-06-09T02:42:00Z" },
    ],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    jobId: parseInt(jobId, 10) || jobId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
