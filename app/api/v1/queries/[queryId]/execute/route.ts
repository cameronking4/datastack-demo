import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries/{queryId}/execute:
 *   post:
 *     summary: Execute query
 *     description: Execute a saved SQL query against its warehouse
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameters:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       202:
 *         description: Accepted
 */
/**
 * POST /api/v1/queries/:queryId/execute
 * Execute a saved SQL query against its warehouse
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const body = (await request.json()) as {
    parameters?: Record<string, string>;
    limit?: number;
  };
  return NextResponse.json(
    {
      executionId: "exec-new",
      queryId,
      warehouseId: "wh-001",
      status: "RUNNING",
      parameters: body.parameters ?? {},
      limit: body.limit ?? 1000,
      submittedAt: new Date().toISOString(),
      submittedBy: "api",
    },
    { status: 202 }
  );
}
