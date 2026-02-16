import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/connections:
 *   get:
 *     summary: List connections
 *     description: List external data source and sink connections
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create connection
 *     description: Create a new data source or sink connection
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/connections
 * List external data source and sink connections
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
      },
      {
        id: "conn-002",
        name: "Postgres Analytics",
        type: "POSTGRESQL",
        host: "analytics-db.acme.internal",
        status: "ACTIVE",
        workspaceId: "ws-001",
        secretScope: "db-prod",
        properties: {
          port: 5432,
          database: "analytics",
          sslMode: "require",
        },
        createdAt: "2024-02-10T14:00:00Z",
        updatedAt: "2024-05-20T09:00:00Z",
        createdBy: "ada@datastack.dev",
        lastTestedAt: "2024-06-10T08:00:00Z",
        lastTestStatus: "SUCCESS",
      },
      {
        id: "conn-003",
        name: "Kafka Streaming",
        type: "KAFKA",
        host: "kafka-cluster.acme.internal:9092",
        status: "ACTIVE",
        workspaceId: "ws-001",
        secretScope: "kafka-prod",
        properties: {
          securityProtocol: "SASL_SSL",
          topicPrefix: "events.",
          consumerGroup: "datastack-ingestion",
        },
        createdAt: "2024-03-05T11:00:00Z",
        updatedAt: "2024-04-15T16:00:00Z",
        createdBy: "bob@datastack.dev",
        lastTestedAt: "2024-06-09T22:00:00Z",
        lastTestStatus: "SUCCESS",
      },
    ],
    totalCount: 3,
    page,
    pageSize,
  });
}

/**
 * POST /api/v1/connections
 * Create a new data source or sink connection
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    type: string;
    host: string;
    workspaceId: string;
    secretScope?: string;
    properties?: Record<string, unknown>;
  };
  return NextResponse.json(
    {
      id: "conn-new",
      name: body.name,
      type: body.type,
      host: body.host,
      status: "PENDING_VALIDATION",
      workspaceId: body.workspaceId,
      secretScope: body.secretScope ?? null,
      properties: body.properties ?? {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
      lastTestedAt: null,
      lastTestStatus: null,
    },
    { status: 201 }
  );
}
