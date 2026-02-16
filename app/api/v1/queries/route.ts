import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries:
 *   get:
 *     summary: List queries
 *     description: List saved SQL queries
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create query
 *     description: Save a new SQL query
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/queries
 * List saved SQL queries
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    queries: [
      {
        id: "query-001",
        name: "Daily Active Users",
        description: "Count distinct users by day",
        warehouseId: "wh-001",
        sql: "SELECT date_trunc('day', created_at) AS day, COUNT(DISTINCT user_id) AS dau FROM main.gold.user_sessions GROUP BY 1 ORDER BY 1 DESC LIMIT 30",
        status: "SAVED",
        lastExecutedAt: "2024-06-10T09:00:00Z",
        lastExecutionDurationMs: 1250,
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-06-10T09:00:00Z",
        createdBy: "ada@datastack.dev",
      },
      {
        id: "query-002",
        name: "Event Volume by Type",
        description: "Aggregate event counts by type over past 7 days",
        warehouseId: "wh-001",
        sql: "SELECT event_type, COUNT(*) AS event_count FROM main.bronze.raw_events WHERE created_at >= current_date - INTERVAL 7 DAY GROUP BY 1 ORDER BY 2 DESC",
        status: "SAVED",
        lastExecutedAt: "2024-06-09T15:00:00Z",
        lastExecutionDurationMs: 3400,
        createdAt: "2024-04-15T14:00:00Z",
        updatedAt: "2024-06-09T15:00:00Z",
        createdBy: "bob@datastack.dev",
      },
    ],
    totalCount: 2,
    page,
    pageSize,
  });
}

/**
 * POST /api/v1/queries
 * Save a new SQL query
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    warehouseId: string;
    sql: string;
    tags?: string[];
  };
  return NextResponse.json(
    {
      id: "query-new",
      name: body.name,
      description: body.description ?? "",
      warehouseId: body.warehouseId,
      sql: body.sql,
      status: "SAVED",
      tags: body.tags ?? [],
      lastExecutedAt: null,
      lastExecutionDurationMs: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
