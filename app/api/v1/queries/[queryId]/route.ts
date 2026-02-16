import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries/{queryId}:
 *   get:
 *     summary: Get query
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update query
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete query
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
/**
 * GET /api/v1/queries/:queryId
 * Get query by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  return NextResponse.json({
    id: queryId,
    name: "Daily Active Users",
    description: "Count distinct users by day",
    warehouseId: "wh-001",
    sql: "SELECT date_trunc('day', created_at) AS day, COUNT(DISTINCT user_id) AS dau FROM main.gold.user_sessions GROUP BY 1 ORDER BY 1 DESC LIMIT 30",
    status: "SAVED",
    tags: ["analytics", "users"],
    lastExecutedAt: "2024-06-10T09:00:00Z",
    lastExecutionDurationMs: 1250,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-10T09:00:00Z",
    createdBy: "ada@datastack.dev",
  });
}

/**
 * PATCH /api/v1/queries/:queryId
 * Update a saved query
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    sql?: string;
    warehouseId?: string;
    tags?: string[];
  };
  return NextResponse.json({
    id: queryId,
    name: body.name ?? "Daily Active Users",
    description: body.description ?? "Count distinct users by day",
    warehouseId: body.warehouseId ?? "wh-001",
    sql: body.sql ?? "SELECT 1",
    status: "SAVED",
    tags: body.tags ?? [],
    lastExecutedAt: "2024-06-10T09:00:00Z",
    lastExecutionDurationMs: 1250,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: new Date().toISOString(),
    createdBy: "ada@datastack.dev",
  });
}

/**
 * DELETE /api/v1/queries/:queryId
 * Delete a saved query
 */
export async function DELETE() {
  return new NextResponse(null, { status: 204 });
}
