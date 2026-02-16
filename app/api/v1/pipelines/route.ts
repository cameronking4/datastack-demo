import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/pipelines:
 *   get:
 *     summary: List pipelines
 *     description: List Delta Live Tables pipelines
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create pipeline
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/pipelines
 * List Delta Live Tables pipelines
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    pipelines: [
      {
        id: "pipe-001",
        name: "Bronze Ingestion",
        workspaceId: "ws-001",
        state: "RUNNING",
        target: "PRODUCTION",
        catalog: "main",
        schema: "bronze",
        continuous: true,
        photon: true,
        edition: "PRO",
        clusters: [
          {
            label: "default",
            nodeType: "i3.xlarge",
            workerCount: 4,
            enableAutoscaling: true,
          },
        ],
        createdAt: "2024-03-01T09:00:00Z",
        createdBy: "ada@datastack.dev",
        lastRunAt: "2024-06-10T02:00:00Z",
      },
      {
        id: "pipe-002",
        name: "Silver Transform",
        workspaceId: "ws-001",
        state: "IDLE",
        target: "DEVELOPMENT",
        catalog: "main",
        schema: "silver",
        continuous: false,
        photon: false,
        edition: "CORE",
        clusters: [],
        createdAt: "2024-04-15T14:00:00Z",
        createdBy: "bob@datastack.dev",
      },
    ],
    totalCount: 2,
  });
}

/**
 * POST /api/v1/pipelines
 * Create pipeline
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    workspaceId: string;
    target: string;
    catalog?: string;
    schema?: string;
    continuous?: boolean;
    photon?: boolean;
    edition?: string;
  };
  return NextResponse.json(
    {
      id: "pipe-new",
      name: body.name,
      workspaceId: body.workspaceId,
      state: "IDLE",
      target: body.target,
      catalog: body.catalog ?? "main",
      schema: body.schema ?? "default",
      continuous: body.continuous ?? false,
      photon: body.photon ?? false,
      edition: body.edition ?? "CORE",
      clusters: [],
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
