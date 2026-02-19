import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/connections/{connectionId}:
 *   get:
 *     summary: Get connection
 *     description: Get connection details including health check status and credentials metadata
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
 *     description: Update connection configuration, credentials, or health check settings
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
 *               port:
 *                 type: integer
 *               authMethod:
 *                 type: string
 *                 enum: [API_KEY, OAUTH2, SERVICE_ACCOUNT, IAM_ROLE, USERNAME_PASSWORD]
 *               credentialRef:
 *                 type: string
 *               healthCheck:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                   intervalSeconds:
 *                     type: integer
 *               properties:
 *                 type: object
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete connection
 *     description: Delete a connection. Fails if any active pipelines or jobs reference it.
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
    port: null,
    status: "ACTIVE",
    workspaceId: "ws-001",
    authMethod: "IAM_ROLE",
    credentialRef: "aws-prod",
    healthCheck: { enabled: true, intervalSeconds: 300 },
    properties: { region: "us-east-1", format: "delta" },
    tags: { env: "production" },
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
    createdBy: "ada@datastack.dev",
    lastTestedAt: "2024-06-10T08:00:00Z",
    lastTestStatus: "SUCCESS",
    lastHealthCheckAt: "2024-06-10T08:05:00Z",
    dependentResources: {
      pipelines: ["pipe-001"],
      jobs: ["job-1001"],
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  const { connectionId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: connectionId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
