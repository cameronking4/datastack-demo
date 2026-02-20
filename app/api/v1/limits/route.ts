import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/limits:
 *   get:
 *     summary: Get limits
 *     description: Get account and workspace limits (quotas)
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");

  return ok(
    {
      workspaceId: workspaceId ?? "ws-001",
      limits: {
        clusters: { max: 50, current: 12 },
        jobs: { max: 200, current: 45 },
        pipelines: { max: 100, current: 23 },
        sqlWarehouses: { max: 30, current: 8 },
        connections: { max: 100, current: 15 },
        webhooks: { max: 50, current: 5 },
        apiKeys: { max: 20, current: 3 },
        users: { max: 100, current: 24 },
      },
      tier: "enterprise",
    },
    { requestId }
  );
}
