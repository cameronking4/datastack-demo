import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}:
 *   get:
 *     summary: Get cluster
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete cluster
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
/**
 * GET /api/v1/clusters/:clusterId
 * Get cluster by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  return NextResponse.json({
    id: clusterId,
    name: "Analytics Cluster",
    clusterSize: "Medium",
    region: "us-east-1",
    state: "RUNNING",
    sparkVersion: "3.5.x-scala2.12",
    nodeType: "i3.xlarge",
    numWorkers: 4,
    autoTerminationMinutes: 30,
    createdAt: "2024-03-01T09:00:00Z",
  });
}

/**
 * DELETE /api/v1/clusters/:clusterId
 * Terminate cluster
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  return NextResponse.json({
    message: `Cluster ${clusterId} termination initiated.`,
  });
}
