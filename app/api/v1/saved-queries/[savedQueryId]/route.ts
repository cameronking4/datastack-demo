import { NextRequest } from "next/server";
import { getRequestId, ok, noContent } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/saved-queries/{savedQueryId}:
 *   get:
 *     summary: Get saved query
 *     parameters:
 *       - in: path
 *         name: savedQueryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update saved query
 *     parameters:
 *       - in: path
 *         name: savedQueryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete saved query
 *     parameters:
 *       - in: path
 *         name: savedQueryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ savedQueryId: string }> }
) {
  const { savedQueryId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      savedQueryId,
      name: "Daily Revenue Summary",
      description: "Aggregate revenue by product and region",
      workspaceId: "ws-001",
      sql: "SELECT date, product_id, region, SUM(amount) AS revenue FROM main.analytics.sales GROUP BY 1, 2, 3",
      createdBy: "ada@datastack.dev",
      createdAt: "2024-06-01T10:00:00Z",
      updatedAt: "2024-08-01T10:00:00Z",
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ savedQueryId: string }> }
) {
  const { savedQueryId } = await params;
  const body = (await request.json()) as { name?: string; description?: string; sql?: string };
  const requestId = getRequestId(request);

  return ok(
    {
      savedQueryId,
      name: body.name ?? "Daily Revenue Summary",
      description: body.description ?? "",
      sql: body.sql ?? "SELECT 1",
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ savedQueryId: string }> }
) {
  await params;
  return noContent();
}
