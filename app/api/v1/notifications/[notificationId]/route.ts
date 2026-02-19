import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/notifications/{notificationId}:
 *   get:
 *     summary: Get notification channel
 *     description: Get notification channel details including delivery statistics
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update notification channel
 *     description: Update notification channel configuration, filters, or quiet hours
 *     parameters:
 *       - in: path
 *         name: notificationId
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
 *               config:
 *                 type: object
 *                 properties:
 *                   recipients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   webhookUrl:
 *                     type: string
 *                   slackChannel:
 *                     type: string
 *               eventFilters:
 *                 type: array
 *                 items:
 *                   type: string
 *               severityFilter:
 *                 type: array
 *                 items:
 *                   type: string
 *               enabled:
 *                 type: boolean
 *               quietHours:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   timezone:
 *                     type: string
 *               rateLimitPerHour:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete notification channel
 *     description: Remove a notification channel
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await params;
  return NextResponse.json({
    id: notificationId,
    name: "Engineering Slack",
    type: "slack",
    config: { slackChannel: "#eng-alerts" },
    eventFilters: ["job.failed", "pipeline.failed", "cluster.terminated"],
    severityFilter: ["error", "critical"],
    enabled: true,
    quietHours: { enabled: true, startTime: "22:00", endTime: "07:00", timezone: "America/New_York" },
    rateLimitPerHour: 30,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-05-15T14:00:00Z",
    deliveryStats: { sent: 450, failed: 5, suppressed: 20 },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: notificationId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
