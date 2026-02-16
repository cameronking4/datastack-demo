import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries/{queryId}/results:
 *   get:
 *     summary: Get query results
 *     description: Get results of the most recent query execution
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/queries/:queryId/results
 * Get results of the most recent query execution
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  return NextResponse.json({
    queryId,
    executionId: "exec-001",
    status: "SUCCEEDED",
    columns: [
      { name: "day", type: "DATE" },
      { name: "dau", type: "BIGINT" },
    ],
    data: [
      ["2024-06-10", 12450],
      ["2024-06-09", 11230],
      ["2024-06-08", 9870],
      ["2024-06-07", 13100],
      ["2024-06-06", 12800],
    ],
    rowCount: 5,
    truncated: false,
    executionDurationMs: 1250,
    bytesScanned: 524288000,
    completedAt: "2024-06-10T09:00:01Z",
  });
}
