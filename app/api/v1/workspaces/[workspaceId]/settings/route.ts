import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/settings:
 *   get:
 *     summary: Get workspace settings
 *     description: Get workspace-level settings (defaults, features, retention)
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update workspace settings
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
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
