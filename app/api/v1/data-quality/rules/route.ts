import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/data-quality/rules:
 *   get:
 *     summary: List data quality rules
 *     description: List data quality validation rules with pass/fail statistics and schedule info
 *     parameters:
 *       - in: query
 *         name: tableId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [passing, failing, disabled, pending]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create data quality rule
 *     description: Define a new data quality rule with expectations and alerting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tableId
 *               - expectation
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               tableId:
 *                 type: string
 *               column:
 *                 type: string
 *               expectation:
 *                 type: object
 *                 required:
 *                   - type
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [not_null, unique, range, regex, custom_sql, freshness, row_count, referential_integrity]
 *                   params:
 *                     type: object
 *                     additionalProperties: true
 *               severity:
 *                 type: string
 *                 enum: [warn, error, critical]
 *               schedule:
 *                 type: object
 *                 properties:
 *                   cron:
 *                     type: string
 *                   timezone:
 *                     type: string
 *               alertOnFailure:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);

  const tableIdFilter = searchParams.get("tableId");
  const statusFilter = searchParams.get("status");

  const rules = [
    {
      id: "dqr-001",
      name: "user_id not null",
      description: "Ensure user_id is never null in events table",
      tableId: "analytics.user_events",
      column: "user_id",
      expectation: { type: "not_null", params: {} },
      severity: "error",
      status: "passing",
      schedule: { cron: "0 * * * *", timezone: "UTC" },
      alertOnFailure: true,
      tags: ["compliance", "core"],
      lastRunAt: "2024-08-15T15:00:00Z",
      lastRunStatus: "PASS",
      passRate: 1.0,
      stats: { totalRuns: 720, passed: 720, failed: 0 },
      createdAt: "2024-03-01T10:00:00Z",
      updatedAt: "2024-08-01T14:00:00Z",
    },
    {
      id: "dqr-002",
      name: "order_total range check",
      description: "Order total must be between 0 and 1,000,000",
      tableId: "commerce.orders",
      column: "total_amount",
      expectation: { type: "range", params: { min: 0, max: 1000000 } },
      severity: "critical",
      status: "failing",
      schedule: { cron: "0 */6 * * *", timezone: "UTC" },
      alertOnFailure: true,
      tags: ["finance", "core"],
      lastRunAt: "2024-08-15T12:00:00Z",
      lastRunStatus: "FAIL",
      passRate: 0.9985,
      stats: { totalRuns: 120, passed: 118, failed: 2 },
      createdAt: "2024-04-15T08:00:00Z",
      updatedAt: "2024-08-10T09:00:00Z",
    },
  ];

  let filtered = rules;
  if (tableIdFilter) filtered = filtered.filter((r) => r.tableId === tableIdFilter);
  if (statusFilter) filtered = filtered.filter((r) => r.status === statusFilter);

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("rules", paged, totalCount, {
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
    tableId: string;
    column?: string;
    expectation: { type: string; params?: Record<string, unknown> };
    severity?: string;
    schedule?: { cron: string; timezone?: string };
    alertOnFailure?: boolean;
    tags?: string[];
  };

  return created(
    {
      id: "dqr-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      tableId: body.tableId,
      column: body.column ?? null,
      expectation: body.expectation,
      severity: body.severity ?? "warn",
      status: "pending",
      schedule: body.schedule ?? null,
      alertOnFailure: body.alertOnFailure ?? false,
      tags: body.tags ?? [],
      lastRunAt: null,
      lastRunStatus: null,
      passRate: null,
      stats: { totalRuns: 0, passed: 0, failed: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
