import { NextRequest } from "next/server";
import { ok, noContent, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/stacks/{stackId}:
 *   get:
 *     summary: Get stack
 *     description: Get stack details including layers, version history, and lock state
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update stack
 *     description: Update stack configuration, layers, or git integration settings
 *     parameters:
 *       - in: path
 *         name: stackId
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
 *               version:
 *                 type: string
 *               layers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - resourceType
 *                     - resourceId
 *                     - order
 *                   properties:
 *                     name:
 *                       type: string
 *                     resourceType:
 *                       type: string
 *                     resourceId:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     config:
 *                       type: object
 *                     dependsOn:
 *                       type: array
 *                       items:
 *                         type: string
 *               connections:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               autoDeployOnPush:
 *                 type: boolean
 *               gitRepository:
 *                 type: string
 *               gitBranch:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete stack
 *     description: Delete a stack. The stack must be unlocked and have no active deployments.
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  const requestId = getRequestId(request);
  return ok({
    id: stackId,
    name: "Analytics Platform",
    description: "End-to-end analytics pipeline",
    workspaceId: "ws-001",
    environment: "production",
    version: "2.4.1",
    lockState: "UNLOCKED",
    lockedBy: null,
    lockedAt: null,
    layers: [
      { name: "Storage", resourceType: "catalog", resourceId: "cat-001", order: 1, dependsOn: [], healthCheck: { enabled: true, endpoint: "/health", intervalSeconds: 60 } },
      { name: "Ingestion", resourceType: "pipeline", resourceId: "pipe-001", order: 2, dependsOn: ["Storage"], healthCheck: null },
      { name: "Transform", resourceType: "job", resourceId: "job-1001", order: 3, dependsOn: ["Ingestion"], healthCheck: null },
    ],
    connections: ["conn-001", "conn-002"],
    tags: { team: "platform", tier: "critical" },
    autoDeployOnPush: true,
    gitRepository: "https://github.com/acme/analytics-stack",
    gitBranch: "main",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-05T14:00:00Z",
    lastDeployedAt: "2024-06-05T14:30:00Z",
    lastDeployStatus: "SUCCESS",
    versionHistory: [
      { version: "2.4.1", deployedAt: "2024-06-05T14:30:00Z", deployedBy: "api" },
      { version: "2.4.0", deployedAt: "2024-05-20T10:00:00Z", deployedBy: "ada@datastack.dev" },
    ],
  }, { requestId });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const requestId = getRequestId(request);
  return ok(
    {
      id: stackId,
      ...body,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  await params;
  return noContent({ requestId: getRequestId(request) });
}
