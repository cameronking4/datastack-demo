import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/deployments/{deploymentId}:
 *   get:
 *     summary: Get deployment
 *     description: Get deployment details including per-layer status
 *     parameters:
 *       - in: path
 *         name: deploymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/deployments/:deploymentId
 * Get deployment details including per-layer status
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> }
) {
  const { deploymentId } = await params;
  return NextResponse.json({
    id: deploymentId,
    stackId: "stack-001",
    stackName: "Analytics Platform",
    version: 3,
    environment: "PRODUCTION",
    status: "SUCCEEDED",
    steps: [
      {
        layer: "ingestion",
        resourceType: "pipeline",
        resourceId: "pipe-001",
        action: "UPDATE",
        status: "SUCCEEDED",
        startedAt: "2024-06-10T08:00:00Z",
        completedAt: "2024-06-10T08:02:10Z",
        logs: "Pipeline configuration updated. Restarted with new settings.",
      },
      {
        layer: "compute",
        resourceType: "cluster",
        resourceId: "cluster-001",
        action: "NO_CHANGE",
        status: "SKIPPED",
        startedAt: null,
        completedAt: null,
        logs: "No changes detected.",
      },
      {
        layer: "transformation",
        resourceType: "job",
        resourceId: "1001",
        action: "UPDATE",
        status: "SUCCEEDED",
        startedAt: "2024-06-10T08:02:10Z",
        completedAt: "2024-06-10T08:04:22Z",
        logs: "Job schedule and notebook path updated.",
      },
      {
        layer: "serving",
        resourceType: "warehouse",
        resourceId: "wh-001",
        action: "NO_CHANGE",
        status: "SKIPPED",
        startedAt: null,
        completedAt: null,
        logs: "No changes detected.",
      },
    ],
    startedAt: "2024-06-10T08:00:00Z",
    completedAt: "2024-06-10T08:05:33Z",
    startedBy: "ada@datastack.dev",
    promotedFrom: "deploy-002",
  });
}
