import { NextRequest } from "next/server";
import {
  listResponse,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/query-history:
 *   get:
 *     summary: List query history
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 50 });
  const requestId = getRequestId(request);
  const warehouseId = searchParams.get("warehouseId");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  const history = [
    {
      queryId: "q-h-001",
      warehouseId: "wh-001",
      userId: "user-1",
      userEmail: "ada@datastack.dev",
      sql: "SELECT * FROM main.analytics.daily_metrics LIMIT 100",
      status: "FINISHED",
      durationMs: 1250,
      rowsReturned: 100,
      startedAt: "2024-08-19T14:30:00Z",
      endedAt: "2024-08-19T14:30:01Z",
    },
    {
      queryId: "q-h-002",
      warehouseId: "wh-001",
      userId: "user-2",
      userEmail: "bob@datastack.dev",
      sql: "SELECT cohort, SUM(revenue) FROM main.analytics.cohorts GROUP BY 1",
      status: "FINISHED",
      durationMs: 3400,
      rowsReturned: 24,
      startedAt: "2024-08-19T14:25:00Z",
      endedAt: "2024-08-19T14:25:03Z",
    },
    {
      queryId: "q-h-003",
      warehouseId: "wh-001",
      userId: "user-1",
      userEmail: "ada@datastack.dev",
      sql: "SELECT * FROM main.raw.events WHERE ts > current_timestamp() - INTERVAL 7 DAYS",
      status: "CANCELLED",
      durationMs: null,
      rowsReturned: null,
      startedAt: "2024-08-19T14:20:00Z",
      endedAt: "2024-08-19T14:21:00Z",
    },
  ];

  let filtered = history;
  if (warehouseId) filtered = filtered.filter((q) => q.warehouseId === warehouseId);
  if (userId) filtered = filtered.filter((q) => q.userId === userId);
  if (status) filtered = filtered.filter((q) => q.status === status);
  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("queries", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}
