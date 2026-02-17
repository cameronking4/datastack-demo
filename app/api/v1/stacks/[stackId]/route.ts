import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks/{stackId}:
 *   get:
 *     summary: Get stack
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
 *               connections:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete stack
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
/**
 * GET /api/v1/stacks/:stackId
 * Get stack by ID with full layer details
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  return NextResponse.json({
    id: stackId,
    name: "Analytics Platform",
    description: "End-to-end analytics stack with ingestion, transformation, and serving layers",
    workspaceId: "ws-001",
    status: "DEPLOYED",
    environment: "PRODUCTION",
    layers: [
      {
        name: "ingestion",
        resourceType: "pipeline",
        resourceId: "pipe-001",
        order: 1,
        status: "HEALTHY",
        lastSyncAt: "2024-06-10T02:15:33Z",
      },
      {
        name: "compute",
        resourceType: "cluster",
        resourceId: "cluster-001",
        order: 2,
        status: "HEALTHY",
        lastSyncAt: "2024-06-10T02:00:00Z",
      },
      {
        name: "transformation",
        resourceType: "job",
        resourceId: "1001",
        order: 3,
        status: "HEALTHY",
        lastSyncAt: "2024-06-10T02:15:33Z",
      },
      {
        name: "serving",
        resourceType: "warehouse",
        resourceId: "wh-001",
        order: 4,
        status: "HEALTHY",
        lastSyncAt: "2024-06-10T02:00:00Z",
      },
    ],
    connections: ["conn-001", "conn-002"],
    version: 3,
    tags: { team: "data-eng", tier: "critical" },
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-10T08:00:00Z",
    createdBy: "ada@datastack.dev",
  });
}

/**
 * PATCH /api/v1/stacks/:stackId
 * Update stack configuration
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    layers?: {
      name: string;
      resourceType: string;
      resourceId: string;
      order: number;
      config?: Record<string, unknown>;
    }[];
    connections?: string[];
    tags?: Record<string, string>;
  };
  return NextResponse.json({
    id: stackId,
    name: body.name ?? "Analytics Platform",
    description: body.description ?? "End-to-end analytics stack",
    workspaceId: "ws-001",
    status: "DRAFT",
    environment: "PRODUCTION",
    layers: body.layers ?? [],
    connections: body.connections ?? [],
    version: 4,
    tags: body.tags ?? {},
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: new Date().toISOString(),
    createdBy: "ada@datastack.dev",
  });
}

/**
 * DELETE /api/v1/stacks/:stackId
 * Delete stack
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  return NextResponse.json({
    message: `Stack ${stackId} deleted.`,
  });
}
