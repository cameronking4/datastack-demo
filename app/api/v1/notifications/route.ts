import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: List notification channels
 *     description: List configured notification channels and preferences
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [email, slack, pagerduty, webhook, teams]
 *       - in: query
 *         name: enabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create notification channel
 *     description: Register a new notification channel for alerts and event notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - config
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [email, slack, pagerduty, webhook, teams]
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
 *                   pagerdutyServiceKey:
 *                     type: string
 *               eventFilters:
 *                 type: array
 *                 items:
 *                   type: string
 *               severityFilter:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [info, warning, error, critical]
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
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    channels: [
      {
        id: "notif-001",
        name: "Engineering Slack",
        type: "slack",
        config: { slackChannel: "#eng-alerts", webhookUrl: null, recipients: [] },
        eventFilters: ["job.failed", "pipeline.failed", "cluster.terminated"],
        severityFilter: ["error", "critical"],
        enabled: true,
        quietHours: { enabled: true, startTime: "22:00", endTime: "07:00", timezone: "America/New_York" },
        rateLimitPerHour: 30,
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-05-15T14:00:00Z",
        deliveryStats: { sent: 450, failed: 5, suppressed: 20 },
      },
      {
        id: "notif-002",
        name: "PagerDuty On-Call",
        type: "pagerduty",
        config: { pagerdutyServiceKey: "****", recipients: [], webhookUrl: null },
        eventFilters: ["pipeline.failed", "cluster.error"],
        severityFilter: ["critical"],
        enabled: true,
        quietHours: { enabled: false, startTime: null, endTime: null, timezone: null },
        rateLimitPerHour: 10,
        createdAt: "2024-03-10T11:00:00Z",
        updatedAt: "2024-06-01T09:00:00Z",
        deliveryStats: { sent: 12, failed: 0, suppressed: 0 },
      },
    ],
    totalCount: 2,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    type: string;
    config: Record<string, unknown>;
    eventFilters?: string[];
    severityFilter?: string[];
    enabled?: boolean;
    quietHours?: Record<string, unknown>;
    rateLimitPerHour?: number;
  };
  return NextResponse.json(
    {
      id: "notif-new",
      name: body.name,
      type: body.type,
      config: body.config,
      eventFilters: body.eventFilters ?? [],
      severityFilter: body.severityFilter ?? ["error", "critical"],
      enabled: body.enabled ?? true,
      quietHours: body.quietHours ?? { enabled: false, startTime: null, endTime: null, timezone: null },
      rateLimitPerHour: body.rateLimitPerHour ?? 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryStats: { sent: 0, failed: 0, suppressed: 0 },
    },
    { status: 201 }
  );
}
