import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/connections:
 *   get:
 *     summary: List connections
 *     description: List external data source and sink connections with health status
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [S3, POSTGRESQL, MYSQL, KAFKA, SNOWFLAKE, BIGQUERY, REDSHIFT, MONGODB, AZURE_BLOB, GCS]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, ERROR, PENDING_VALIDATION]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create connection
 *     description: Create a new data source or sink connection with authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - host
 *               - workspaceId
 *               - authMethod
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [S3, POSTGRESQL, MYSQL, KAFKA, SNOWFLAKE, BIGQUERY, REDSHIFT, MONGODB, AZURE_BLOB, GCS]
 *               host:
 *                 type: string
 *               port:
 *                 type: integer
 *               workspaceId:
 *                 type: string
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
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    connections: [
      {
        id: "conn-001",
        name: "Production S3",
        type: "S3",
        host: "s3://acme-data-lake",
        port: null,
        status: "ACTIVE",
        workspaceId: "ws-001",
        authMethod: "IAM_ROLE",
        credentialRef: "aws-prod",
        healthCheck: { enabled: true, intervalSeconds: 300 },
        properties: {
          region: "us-east-1",
          format: "delta",
          pathPrefix: "/raw/events",
        },
        tags: { env: "production" },
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
        createdBy: "ada@datastack.dev",
        lastTestedAt: "2024-06-10T08:00:00Z",
        lastTestStatus: "SUCCESS",
        lastHealthCheckAt: "2024-06-10T08:05:00Z",
      },
      {
        id: "conn-002",
        name: "Postgres Analytics",
        type: "POSTGRESQL",
        host: "analytics-db.acme.internal",
        port: 5432,
        status: "ACTIVE",
        workspaceId: "ws-001",
        authMethod: "USERNAME_PASSWORD",
        credentialRef: "db-prod",
        healthCheck: { enabled: true, intervalSeconds: 60 },
        properties: {
          database: "analytics",
          sslMode: "require",
        },
        tags: { env: "production", team: "analytics" },
        createdAt: "2024-02-10T14:00:00Z",
        updatedAt: "2024-05-20T09:00:00Z",
        createdBy: "ada@datastack.dev",
        lastTestedAt: "2024-06-10T08:00:00Z",
        lastTestStatus: "SUCCESS",
        lastHealthCheckAt: "2024-06-10T08:01:00Z",
      },
    ],
    totalCount: 2,
    page,
    pageSize,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    type: string;
    host: string;
    port?: number;
    workspaceId: string;
    authMethod: string;
    credentialRef?: string;
    healthCheck?: { enabled: boolean; intervalSeconds: number };
    properties?: Record<string, unknown>;
    tags?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "conn-new",
      name: body.name,
      type: body.type,
      host: body.host,
      port: body.port ?? null,
      status: "PENDING_VALIDATION",
      workspaceId: body.workspaceId,
      authMethod: body.authMethod,
      credentialRef: body.credentialRef ?? null,
      healthCheck: body.healthCheck ?? { enabled: false, intervalSeconds: 300 },
      properties: body.properties ?? {},
      tags: body.tags ?? {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
      lastTestedAt: null,
      lastTestStatus: null,
    },
    { status: 201 }
  );
}
