import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/schedules/{scheduleId}:
 *   get:
 *     summary: Get schedule
 *     description: Get schedule details including fire history and next execution time
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update schedule
 *     description: Update schedule expression, timezone, or activation state
 *     parameters:
 *       - in: path
 *         name: scheduleId
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
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete schedule
 *     description: Delete a schedule. The associated resource will no longer be triggered automatically.
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params;
  return NextResponse.json({
    id: scheduleId,
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
    fireHistory: [
      { firedAt: "2024-06-10T02:00:00Z", status: "SUCCESS", triggeredRunId: "run-100" },
      { firedAt: "2024-06-09T02:00:00Z", status: "SUCCESS", triggeredRunId: "run-099" },
    ],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-05-01T14:00:00Z",
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: scheduleId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
