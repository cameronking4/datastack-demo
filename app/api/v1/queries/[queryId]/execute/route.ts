import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries/{queryId}/execute:
 *   post:
 *     summary: Execute query
 *     description: Execute a saved SQL query with optional parameter overrides and result format
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
 *               resultFormat:
 *                 type: string
 *                 enum: [JSON, CSV, ARROW]
 *               timeout:
 *                 type: integer
 *               catalog:
 *                 type: string
 *               schema:
 *                 type: string
 *               warehouseOverride:
 *                 type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(
    {
      executionId: "exec-" + Date.now(),
      queryId,
      status: "QUEUED",
      resultFormat: body.resultFormat ?? "JSON",
      submittedAt: new Date().toISOString(),
    },
    { status: 202 }
  );
}
