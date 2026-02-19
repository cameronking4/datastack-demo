import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/queries/{queryId}:
 *   get:
 *     summary: Get query
 *     description: Get saved query details including execution history
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
 *     description: Update query text, parameters, or metadata
 *     parameters:
 *       - in: path
 *         name: queryId
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
 *               description:
 *                 type: string
 *               queryText:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               catalog:
 *                 type: string
 *               schema:
 *                 type: string
 *               resultFormat:
 *                 type: string
 *                 enum: [JSON, CSV, ARROW]
 *               timeout:
 *                 type: integer
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     defaultValue:
 *                       type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete query
 *     description: Permanently delete a saved query
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
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  return NextResponse.json({
    id: queryId,
    name: "Daily Active Users",
    description: "Count DAU by platform",
    warehouseId: "wh-001",
    queryText: "SELECT platform, COUNT(DISTINCT user_id) AS dau FROM events WHERE event_date = CURRENT_DATE GROUP BY platform",
    catalog: "main",
    schema: "analytics",
    resultFormat: "JSON",
    timeout: 300,
    parameters: [],
    tags: ["analytics", "daily"],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
    createdBy: "ada@datastack.dev",
    lastExecutedAt: "2024-06-10T09:00:00Z",
    executionCount: 180,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: queryId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
