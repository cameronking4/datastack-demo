import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/feature-flags
 * Get feature flags and experiments for the current user/workspace.
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
