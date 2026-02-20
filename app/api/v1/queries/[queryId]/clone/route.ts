import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/queries/{queryId}/clone:
 *   post:
 *     summary: Clone query
 *     description: Clone a saved query with a new name
 *     parameters:
 *       - in: path
 *         name: queryId
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
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { name?: string };

  return created(
    {
      id: "q-clone",
      sourceQueryId: queryId,
      name: body.name ?? `Copy of query`,
      warehouseId: "wh-001",
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
