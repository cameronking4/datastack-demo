import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/saved-queries:
 *   get:
 *     summary: List saved queries
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create saved query
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
 *               sql:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");

  const saved = [
    {
      savedQueryId: "sq-001",
      name: "Daily Revenue Summary",
      description: "Aggregate revenue by product and region",
      workspaceId: "ws-001",
      sql: "SELECT date, product_id, region, SUM(amount) AS revenue FROM main.analytics.sales GROUP BY 1, 2, 3",
      createdBy: "ada@datastack.dev",
      createdAt: "2024-06-01T10:00:00Z",
      updatedAt: "2024-08-01T10:00:00Z",
    },
    {
      savedQueryId: "sq-002",
      name: "Active Users Last 7d",
      description: "Distinct users with activity in the past week",
      workspaceId: "ws-001",
      sql: "SELECT COUNT(DISTINCT user_id) FROM main.analytics.events WHERE event_time >= current_timestamp() - INTERVAL 7 DAYS",
      createdBy: "bob@datastack.dev",
      createdAt: "2024-07-15T00:00:00Z",
      updatedAt: "2024-07-15T00:00:00Z",
    },
  ];

  let filtered = saved;
  if (workspaceId) filtered = filtered.filter((q) => q.workspaceId === workspaceId);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("savedQueries", paged, totalCount, {
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
    workspaceId: string;
    sql: string;
  };

  return created(
    {
      savedQueryId: "sq-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      sql: body.sql,
      createdBy: "api",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
