import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/entitlements:
 *   get:
 *     summary: List entitlements
 *     description: Get feature and resource entitlements for the current user or workspace
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [user, workspace]
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);
  const searchParams = request.nextUrl.searchParams;
  const workspaceId = searchParams.get("workspaceId") ?? "ws-001";
  const scope = searchParams.get("scope") ?? "workspace";

  return ok(
    {
      scope,
      workspaceId: scope === "workspace" ? workspaceId : null,
      features: {
        deltaLiveTables: true,
        mlRuntime: true,
        streaming: true,
        photon: true,
        governance: true,
        maxPipelines: 50,
        maxClusters: 10,
      },
      limits: {
        dbusPerMonth: 500000,
        storageGb: 5000,
        apiCallsPerMonth: 100000,
      },
      expiresAt: "2025-12-31T23:59:59Z",
      evaluatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
