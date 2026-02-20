import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/feature-flags:
 *   get:
 *     summary: Get feature flags
 *     description: Get feature flags and experiments for the current user or workspace
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
  const requestId = getRequestId(request);
  const searchParams = request.nextUrl.searchParams;
  const workspaceId = searchParams.get("workspaceId") ?? "ws-001";

  return ok(
    {
      workspaceId,
      flags: {
        streamingV2: true,
        mlFeatureStore: true,
        governanceAuditExport: true,
        backupRestore: true,
        workspaceTemplates: false,
      },
      experiments: {
        newJobUI: { variant: "control", weight: 0.5 },
        queryOptimizer: { variant: "treatment", weight: 0.1 },
      },
      evaluatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
