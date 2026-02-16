import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks/{stackId}/deploy:
 *   post:
 *     summary: Deploy stack
 *     description: Deploy all layers of a stack to the target environment
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
/**
 * POST /api/v1/stacks/:stackId/deploy
 * Deploy all layers of a stack to the target environment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  const body = (await request.json()) as {
    environment?: string;
    dryRun?: boolean;
    force?: boolean;
  };
  return NextResponse.json(
    {
      deploymentId: "deploy-new",
      stackId,
      environment: body.environment ?? "PRODUCTION",
      dryRun: body.dryRun ?? false,
      status: body.dryRun ? "VALIDATED" : "IN_PROGRESS",
      version: 4,
      steps: [
        {
          layer: "ingestion",
          resourceType: "pipeline",
          resourceId: "pipe-001",
          action: "UPDATE",
          status: body.dryRun ? "PLANNED" : "IN_PROGRESS",
        },
        {
          layer: "compute",
          resourceType: "cluster",
          resourceId: "cluster-001",
          action: "NO_CHANGE",
          status: body.dryRun ? "PLANNED" : "SKIPPED",
        },
        {
          layer: "transformation",
          resourceType: "job",
          resourceId: "1001",
          action: "UPDATE",
          status: body.dryRun ? "PLANNED" : "PENDING",
        },
        {
          layer: "serving",
          resourceType: "warehouse",
          resourceId: "wh-001",
          action: "NO_CHANGE",
          status: body.dryRun ? "PLANNED" : "SKIPPED",
        },
      ],
      startedAt: new Date().toISOString(),
      startedBy: "api",
    },
    { status: 202 }
  );
}
