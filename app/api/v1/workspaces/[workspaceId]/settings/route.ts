import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/workspaces/{workspaceId}/settings
 * Get workspace-level settings (defaults, features, retention).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      workspaceId,
      defaults: {
        clusterAutoTerminationMinutes: 120,
        jobRetryPolicy: { maxRetries: 3, retryIntervalSeconds: 300 },
        pipelineEdition: "CORE",
      },
      features: {
        photonEnabled: true,
        deltaSharingEnabled: false,
        mlflowTracking: true,
      },
      retention: {
        jobRunLogsDays: 30,
        queryHistoryDays: 90,
        auditLogDays: 365,
      },
      security: {
        ipAccessListEnabled: false,
        requireMfaForApi: false,
      },
    },
    { requestId }
  );
}

/**
 * PATCH /api/v1/workspaces/{workspaceId}/settings
 * Update workspace-level settings.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as Record<string, unknown>;

  return ok(
    {
      workspaceId,
      ...body,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
