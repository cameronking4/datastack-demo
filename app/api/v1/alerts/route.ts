import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/alerts:
 *   get:
 *     summary: List alert rules
 *     description: List configured alert rules with trigger conditions and notification channels
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [info, warning, critical]
 *       - in: query
 *         name: enabled
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create alert rule
 *     description: Create a new alert rule with conditions, thresholds, and notification channels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - condition
 *               - channels
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               condition:
 *                 type: object
 *                 required:
 *                   - metric
 *                   - operator
 *                   - threshold
 *                 properties:
 *                   metric:
 *                     type: string
 *                   operator:
 *                     type: string
 *                     enum: [gt, gte, lt, lte, eq, neq]
 *                   threshold:
 *                     type: number
 *                   windowMinutes:
 *                     type: integer
 *                   aggregation:
 *                     type: string
 *                     enum: [avg, sum, min, max, count, p99]
 *               severity:
 *                 type: string
 *                 enum: [info, warning, critical]
 *               channels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [email, slack, pagerduty, webhook]
 *                     target:
 *                       type: string
 *               resource:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [pipeline, cluster, stream, job]
 *               cooldownMinutes:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);

  const severityFilter = searchParams.get("severity");
  const enabledFilter = searchParams.get("enabled");
  const resourceFilter = searchParams.get("resource");

  const alerts = [
    {
      id: "alert-001",
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
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-08-01T14:00:00Z",
    },
    {
      id: "alert-002",
      name: "Cluster CPU Saturation",
      description: "Alert on sustained high CPU usage across cluster",
      condition: {
        metric: "cluster.cpu_utilization",
        operator: "gte",
        threshold: 90,
        windowMinutes: 15,
        aggregation: "p99",
      },
      severity: "warning",
      channels: [{ type: "email", target: "infra@datastack.dev" }],
      resource: null,
      resourceType: "cluster",
      cooldownMinutes: 60,
      enabled: true,
      lastTriggeredAt: "2024-08-10T18:00:00Z",
      triggerCount: 5,
      createdAt: "2024-05-15T08:00:00Z",
      updatedAt: "2024-07-20T11:00:00Z",
    },
  ];

  let filtered = alerts;
  if (severityFilter) filtered = filtered.filter((a) => a.severity === severityFilter);
  if (enabledFilter !== null && enabledFilter !== undefined) {
    const enabled = enabledFilter === "true";
    filtered = filtered.filter((a) => a.enabled === enabled);
  }
  if (resourceFilter) filtered = filtered.filter((a) => a.resource === resourceFilter);

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("alerts", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    description?: string;
    condition: {
      metric: string;
      operator: string;
      threshold: number;
      windowMinutes?: number;
      aggregation?: string;
    };
    severity?: string;
    channels: { type: string; target: string }[];
    resource?: string;
    resourceType?: string;
    cooldownMinutes?: number;
    enabled?: boolean;
  };

  return created(
    {
      id: "alert-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      condition: body.condition,
      severity: body.severity ?? "warning",
      channels: body.channels,
      resource: body.resource ?? null,
      resourceType: body.resourceType ?? null,
      cooldownMinutes: body.cooldownMinutes ?? 30,
      enabled: body.enabled ?? true,
      lastTriggeredAt: null,
      triggerCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
