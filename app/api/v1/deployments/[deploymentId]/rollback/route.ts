import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/deployments/{deploymentId}/rollback:
 *   post:
 *     summary: Rollback deployment
 *     description: Rollback to a previous deployment version
 *     parameters:
 *       - in: path
 *         name: deploymentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       202:
 *         description: Accepted
 */
/**
 * POST /api/v1/deployments/:deploymentId/rollback
 * Rollback to a previous deployment version
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> }
) {
  const { deploymentId } = await params;
  return NextResponse.json(
    {
      id: "deploy-rollback",
      stackId: "stack-001",
      stackName: "Analytics Platform",
      version: 2,
      environment: "PRODUCTION",
      status: "IN_PROGRESS",
      rollbackFrom: deploymentId,
      rollbackTo: "deploy-002",
      steps: [
        {
          layer: "ingestion",
          resourceType: "pipeline",
          resourceId: "pipe-001",
          action: "ROLLBACK",
          status: "PENDING",
        },
        {
          layer: "compute",
          resourceType: "cluster",
          resourceId: "cluster-001",
          action: "NO_CHANGE",
          status: "SKIPPED",
        },
        {
          layer: "transformation",
          resourceType: "job",
          resourceId: "1001",
          action: "ROLLBACK",
          status: "PENDING",
        },
        {
          layer: "serving",
          resourceType: "warehouse",
          resourceId: "wh-001",
          action: "NO_CHANGE",
          status: "SKIPPED",
        },
      ],
      startedAt: new Date().toISOString(),
      startedBy: "api",
    },
    { status: 202 }
  );
}
