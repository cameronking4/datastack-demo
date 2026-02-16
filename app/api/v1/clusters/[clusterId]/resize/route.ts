import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}/resize:
 *   post:
 *     summary: Resize cluster
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/clusters/:clusterId/resize
 * Resize cluster (change worker count)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  const body = (await request.json()) as { workerCount: number };
  return NextResponse.json({
    id: clusterId,
    name: "Analytics Cluster",
    workspaceId: "ws-001",
    clusterSize: "Medium",
    region: "us-east-1",
    state: "RESIZING",
    sparkVersion: "3.5.x-scala2.12",
    nodeType: "i3.xlarge",
    workerCount: body.workerCount,
    autoTerminationMinutes: 30,
    createdAt: "2024-03-01T09:00:00Z",
    createdBy: "ada@datastack.dev",
  });
}
