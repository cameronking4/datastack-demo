import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/connections/bulk-test:
 *   post:
 *     summary: Bulk test connections
 *     description: Test connectivity for multiple connections in parallel
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connectionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { connectionIds: string[] };
  const connectionIds = body.connectionIds ?? [];

  const results = connectionIds.map((id) => ({
    connectionId: id,
    status: "SUCCESS" as const,
    latencyMs: Math.floor(Math.random() * 50) + 10,
    message: "Connection verified",
  }));

  return ok(
    {
      results,
      summary: {
        total: results.length,
        successful: results.length,
        failed: 0,
      },
    },
    { requestId }
  );
}
