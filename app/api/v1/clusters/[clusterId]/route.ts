import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}:
 *   get:
 *     summary: Get cluster
 *     description: Get cluster details including runtime metrics and configuration
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update cluster
 *     description: Update cluster configuration. Some changes require a restart.
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
 *             properties:
 *               name:
 *                 type: string
 *               numWorkers:
 *                 type: integer
 *               nodeType:
 *                 type: string
 *               driverNodeType:
 *                 type: string
 *               autoTerminationMinutes:
 *                 type: integer
 *               enableAutoscaling:
 *                 type: boolean
 *               minWorkers:
 *                 type: integer
 *               maxWorkers:
 *                 type: integer
 *               spotInstances:
 *                 type: boolean
 *               runtimeEngine:
 *                 type: string
 *                 enum: [STANDARD, PHOTON]
 *               customSparkConf:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Terminate cluster
 *     description: Permanently terminate a cluster and release all resources
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
    runtimeVersion: "14.3.x-scala2.12",
    nodeType: "i3.xlarge",
    driverNodeType: "i3.xlarge",
    numWorkers: 4,
    enableAutoscaling: true,
    minWorkers: 2,
    maxWorkers: 8,
    autoTerminationMinutes: 120,
    spotInstances: false,
    runtimeEngine: "PHOTON",
    clusterPolicyId: "policy-default",
    instancePoolId: null,
    initScripts: [],
    customSparkConf: {},
    tags: { team: "analytics", env: "production" },
    createdAt: "2024-03-01T09:00:00Z",
    lastActivityAt: "2024-06-10T08:00:00Z",
    uptimeSeconds: 86400,
    sparkContextId: "spark-ctx-001",
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: clusterId,
    ...body,
    state: "RECONFIGURING",
    updatedAt: new Date().toISOString(),
    requiresRestart: !!(body.nodeType || body.driverNodeType || body.runtimeEngine),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
