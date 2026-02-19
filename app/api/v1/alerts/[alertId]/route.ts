import { NextRequest } from "next/server";
import { ok, noContent, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/alerts/{alertId}:
 *   get:
 *     summary: Get alert rule
 *     description: Get alert rule details including trigger history
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update alert rule
 *     description: Update alert rule conditions, channels, or enabled state
 *     parameters:
 *       - in: path
 *         name: alertId
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
 *               condition:
 *                 type: object
 *                 properties:
 *                   metric:
 *                     type: string
 *                   operator:
 *                     type: string
 *                   threshold:
 *                     type: number
 *                   windowMinutes:
 *                     type: integer
 *               severity:
 *                 type: string
 *                 enum: [info, warning, critical]
 *               channels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     target:
 *                       type: string
 *               enabled:
 *                 type: boolean
 *               cooldownMinutes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete alert rule
 *     description: Permanently delete an alert rule
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      id: alertId,
      name: "Pipeline Failure Rate",
      description: "Alert when pipeline failure rate exceeds threshold",
      condition: {
        metric: "pipeline.failure_rate",
        operator: "gt",
        threshold: 0.1,
        windowMinutes: 30,
        aggregation: "avg",
      },
      severity: "critical",
      channels: [
        { type: "slack", target: "#data-alerts" },
        { type: "pagerduty", target: "data-oncall" },
      ],
      resource: "pipe-001",
      resourceType: "pipeline",
      cooldownMinutes: 15,
      enabled: true,
      lastTriggeredAt: "2024-08-14T22:30:00Z",
      triggerCount: 12,
      recentTriggers: [
        { triggeredAt: "2024-08-14T22:30:00Z", resolvedAt: "2024-08-14T23:00:00Z", value: 0.15 },
        { triggeredAt: "2024-08-13T10:00:00Z", resolvedAt: "2024-08-13T10:45:00Z", value: 0.12 },
      ],
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-08-01T14:00:00Z",
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as Record<string, unknown>;

  return ok(
    {
      id: alertId,
      ...body,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  await params;
  const requestId = getRequestId(request);
  return noContent({ requestId });
}
