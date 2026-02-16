import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/deployments/{deploymentId}/promote:
 *   post:
 *     summary: Promote deployment
 *     description: Promote a deployment to the next environment (dev -> staging -> production)
 *     parameters:
 *       - in: path
 *         name: deploymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
/**
 * POST /api/v1/deployments/:deploymentId/promote
 * Promote a deployment to the next environment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> }
) {
  const { deploymentId } = await params;
  const body = (await request.json()) as {
    targetEnvironment?: string;
  };
  return NextResponse.json(
    {
      id: "deploy-new",
      stackId: "stack-001",
      stackName: "Analytics Platform",
      version: 3,
      environment: body.targetEnvironment ?? "PRODUCTION",
      status: "IN_PROGRESS",
      promotedFrom: deploymentId,
      steps: [
        {
          layer: "ingestion",
          resourceType: "pipeline",
          resourceId: "pipe-001",
          action: "CREATE",
          status: "PENDING",
        },
        {
          layer: "compute",
          resourceType: "cluster",
          resourceId: "cluster-001",
          action: "CREATE",
          status: "PENDING",
        },
        {
          layer: "transformation",
          resourceType: "job",
          resourceId: "1001",
          action: "CREATE",
          status: "PENDING",
        },
        {
          layer: "serving",
          resourceType: "warehouse",
          resourceId: "wh-001",
          action: "CREATE",
          status: "PENDING",
        },
      ],
      startedAt: new Date().toISOString(),
      startedBy: "api",
    },
    { status: 202 }
  );
}
