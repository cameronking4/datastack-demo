import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled } from "@/lib/api/preview";

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workerCount
 *             properties:
 *               workerCount:
 *                 type: integer
 *               nodeType:
 *                 type: string
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
  const preview = isPreviewEnabled(request);
  const { clusterId } = await params;
  const body = (await request.json()) as {
    workerCount: number;
    nodeType?: string;
    enableAutoscaling?: boolean;
    minWorkers?: number;
    maxWorkers?: number;
  };

  const response: Record<string, unknown> = {
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
  };

  if (preview) {
    if (body.nodeType) response.nodeType = body.nodeType;
    response.enableAutoscaling = body.enableAutoscaling ?? false;
    response.minWorkers = body.minWorkers ?? 1;
    response.maxWorkers = body.maxWorkers ?? 8;
  }

  return NextResponse.json(response);
}
