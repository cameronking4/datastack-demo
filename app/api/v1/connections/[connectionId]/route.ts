import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/connections/{connectionId}:
 *   get:
 *     summary: Get connection
 *     parameters:
 *       - in: path
 *         name: connectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update connection
 *     parameters:
 *       - in: path
 *         name: connectionId
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
 *               host:
 *                 type: string
 *               secretScope:
 *                 type: string
 *               properties:
 *                 type: object
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete connection
 *     parameters:
 *       - in: path
 *         name: connectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
/**
 * GET /api/v1/connections/:connectionId
 * Get connection by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  const { connectionId } = await params;
  return NextResponse.json({
    id: connectionId,
    name: "Production S3",
    type: "S3",
    host: "s3://acme-data-lake",
    status: "ACTIVE",
    workspaceId: "ws-001",
    secretScope: "aws-prod",
    properties: {
      region: "us-east-1",
      format: "delta",
      pathPrefix: "/raw/events",
    },
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
    createdBy: "ada@datastack.dev",
    lastTestedAt: "2024-06-10T08:00:00Z",
    lastTestStatus: "SUCCESS",
  });
}

/**
 * PATCH /api/v1/connections/:connectionId
 * Update connection
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  const { connectionId } = await params;
  const body = (await request.json()) as {
    name?: string;
    host?: string;
    secretScope?: string;
    properties?: Record<string, unknown>;
  };
  return NextResponse.json({
    id: connectionId,
    name: body.name ?? "Production S3",
    type: "S3",
    host: body.host ?? "s3://acme-data-lake",
    status: "ACTIVE",
    workspaceId: "ws-001",
    secretScope: body.secretScope ?? "aws-prod",
    properties: body.properties ?? {},
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: new Date().toISOString(),
    createdBy: "ada@datastack.dev",
  });
}

/**
 * DELETE /api/v1/connections/:connectionId
 * Delete connection
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  const { connectionId } = await params;
  return NextResponse.json({
    message: `Connection ${connectionId} deleted.`,
  });
}
