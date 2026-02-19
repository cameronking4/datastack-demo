import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: List schedules
 *     description: List unified schedules across jobs, pipelines, and maintenance windows
 *     parameters:
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *           enum: [job, pipeline, maintenance]
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create schedule
 *     description: Create a new cron or interval-based schedule for a resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - resourceType
 *               - resourceId
 *               - scheduleExpression
 *             properties:
 *               name:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [job, pipeline, maintenance]
 *               resourceId:
 *                 type: string
 *               scheduleExpression:
 *                 type: string
 *               timezone:
 *                 type: string
 *               active:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               skipIfRunning:
 *                 type: boolean
 *               catchUpMissed:
 *                 type: boolean
 *               parameters:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    schedules: [
      {
        id: "sched-001",
        name: "Daily ETL Schedule",
        resourceType: "job",
        resourceId: "job-1001",
        scheduleExpression: "0 2 * * *",
        timezone: "UTC",
        active: true,
        startDate: "2024-02-01T00:00:00Z",
        endDate: null,
        skipIfRunning: true,
        catchUpMissed: false,
        parameters: {},
        nextFireAt: "2024-06-11T02:00:00Z",
        lastFiredAt: "2024-06-10T02:00:00Z",
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-05-01T14:00:00Z",
      },
      {
        id: "sched-002",
        name: "Hourly Ingestion",
        resourceType: "pipeline",
        resourceId: "pipe-001",
        scheduleExpression: "0 * * * *",
        timezone: "UTC",
        active: true,
        startDate: "2024-03-01T00:00:00Z",
        endDate: null,
        skipIfRunning: false,
        catchUpMissed: true,
        parameters: { mode: "incremental" },
        nextFireAt: "2024-06-10T09:00:00Z",
        lastFiredAt: "2024-06-10T08:00:00Z",
        createdAt: "2024-03-01T09:00:00Z",
        updatedAt: "2024-04-15T11:00:00Z",
      },
    ],
    totalCount: 2,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    resourceType: string;
    resourceId: string;
    scheduleExpression: string;
    timezone?: string;
    active?: boolean;
    startDate?: string;
    endDate?: string;
    skipIfRunning?: boolean;
    catchUpMissed?: boolean;
    parameters?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "sched-new",
      name: body.name,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      scheduleExpression: body.scheduleExpression,
      timezone: body.timezone ?? "UTC",
      active: body.active ?? true,
      startDate: body.startDate ?? new Date().toISOString(),
      endDate: body.endDate ?? null,
      skipIfRunning: body.skipIfRunning ?? false,
      catchUpMissed: body.catchUpMissed ?? false,
      parameters: body.parameters ?? {},
      nextFireAt: null,
      lastFiredAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
