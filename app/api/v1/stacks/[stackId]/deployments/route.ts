import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks/{stackId}/deployments:
 *   get:
 *     summary: List stack deployments
 *     description: List deployment history for a stack
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/stacks/:stackId/deployments
 * List deployment history for a stack
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  return NextResponse.json({
    deployments: [
      {
        id: "deploy-003",
        stackId,
        version: 3,
        environment: "PRODUCTION",
        status: "SUCCEEDED",
        layersDeployed: 4,
        layersFailed: 0,
        startedAt: "2024-06-10T08:00:00Z",
        completedAt: "2024-06-10T08:05:33Z",
        startedBy: "ada@datastack.dev",
      },
      {
        id: "deploy-002",
        stackId,
        version: 2,
        environment: "PRODUCTION",
        status: "SUCCEEDED",
        layersDeployed: 3,
        layersFailed: 0,
        startedAt: "2024-05-15T10:00:00Z",
        completedAt: "2024-05-15T10:03:12Z",
        startedBy: "ada@datastack.dev",
      },
      {
        id: "deploy-001",
        stackId,
        version: 1,
        environment: "STAGING",
        status: "SUCCEEDED",
        layersDeployed: 2,
        layersFailed: 0,
        startedAt: "2024-02-01T10:00:00Z",
        completedAt: "2024-02-01T10:02:45Z",
        startedBy: "ada@datastack.dev",
      },
    ],
    totalCount: 3,
  });
}
