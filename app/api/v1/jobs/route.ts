import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: List jobs
 *     description: List jobs with optional filters by state, owner, and tags
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [ACTIVE, PAUSED, DISABLED]
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tagFilter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create job
 *     description: Create a new scheduled or triggered job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - triggerType
 *               - settings
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
 *                       enum: [EMAIL, SLACK, PAGERDUTY, WEBHOOK]
 *                     destination:
 *                       type: string
 *                     onStart:
 *                       type: boolean
 *                     onSuccess:
 *                       type: boolean
 *                     onFailure:
 *                       type: boolean
 *               settings:
 *                 type: object
 *                 properties:
 *                   clusterId:
 *                     type: string
 *                   notebookPath:
 *                     type: string
 *                   timeoutSeconds:
 *                     type: integer
 *                   environmentVars:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *                   libraries:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         pypi:
 *                           type: object
 *                           properties:
 *                             package:
 *                               type: string
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));

  return NextResponse.json({
    jobs: [
      {
        jobId: 1001,
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
      },
      {
        jobId: 1002,
        name: "Weekly Report",
        description: "Aggregate metrics and send report",
        schedule: "0 0 9 ? * MON",
        timezone: "America/New_York",
        triggerType: "PERIODIC",
        maxConcurrentRuns: 1,
        retryPolicy: {
          maxRetries: 2,
          retryIntervalSeconds: 300,
          retryOnTimeout: false,
        },
        settings: {
          clusterId: "cluster-002",
          notebookPath: "/Workspace/Reports/weekly",
          timeoutSeconds: 7200,
        },
        state: "ACTIVE",
        tags: { team: "analytics" },
        createdAt: "2024-02-15T08:00:00Z",
        updatedAt: "2024-05-20T11:00:00Z",
        createdBy: "ada@datastack.dev",
        lastRunAt: "2024-06-03T09:00:00Z",
        lastRunStatus: "SUCCESS",
        nextRunAt: "2024-06-10T09:00:00Z",
      },
    ],
    totalCount: 2,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    schedule?: string;
    timezone?: string;
    triggerType: string;
    maxConcurrentRuns?: number;
    retryPolicy?: { maxRetries: number; retryIntervalSeconds: number; retryOnTimeout: boolean };
    alertDestinations?: { type: string; destination: string; onStart: boolean; onSuccess: boolean; onFailure: boolean }[];
    settings: { clusterId: string; notebookPath: string; timeoutSeconds: number };
    tags?: Record<string, string>;
  };

  return NextResponse.json(
    {
      jobId: 2001,
      name: body.name,
      description: body.description ?? "",
      schedule: body.schedule ?? null,
      timezone: body.timezone ?? "UTC",
      triggerType: body.triggerType,
      maxConcurrentRuns: body.maxConcurrentRuns ?? 1,
      retryPolicy: body.retryPolicy ?? { maxRetries: 0, retryIntervalSeconds: 0, retryOnTimeout: false },
      alertDestinations: body.alertDestinations ?? [],
      settings: body.settings,
      state: "ACTIVE",
      tags: body.tags ?? {},
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
