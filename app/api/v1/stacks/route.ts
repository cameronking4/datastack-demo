import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks:
 *   get:
 *     summary: List stacks
 *     description: List composable infrastructure stacks
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create stack
 *     description: Create a new composable infrastructure stack
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/stacks
 * List composable infrastructure stacks with optional filters
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    stacks: [
      {
        id: "stack-001",
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
          },
          {
            name: "compute",
            resourceType: "cluster",
            resourceId: "cluster-001",
            order: 2,
          },
          {
            name: "transformation",
            resourceType: "job",
            resourceId: "1001",
            order: 3,
          },
          {
            name: "serving",
            resourceType: "warehouse",
            resourceId: "wh-001",
            order: 4,
          },
        ],
        connections: ["conn-001", "conn-002"],
        version: 3,
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-06-10T08:00:00Z",
        createdBy: "ada@datastack.dev",
      },
      {
        id: "stack-002",
        name: "ML Feature Store",
        description: "Feature engineering and serving stack for ML models",
        workspaceId: "ws-001",
        status: "DRAFT",
        environment: "DEVELOPMENT",
        layers: [
          {
            name: "feature-ingestion",
            resourceType: "pipeline",
            resourceId: "pipe-002",
            order: 1,
          },
          {
            name: "feature-compute",
            resourceType: "cluster",
            resourceId: "cluster-002",
            order: 2,
          },
        ],
        connections: ["conn-003"],
        version: 1,
        createdAt: "2024-05-01T14:00:00Z",
        updatedAt: "2024-05-01T14:00:00Z",
        createdBy: "bob@datastack.dev",
      },
    ],
    totalCount: 2,
    page,
    pageSize,
  });
}

/**
 * POST /api/v1/stacks
 * Create a new composable infrastructure stack
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    environment: string;
    layers: {
      name: string;
      resourceType: string;
      resourceId: string;
      order: number;
      config?: Record<string, unknown>;
    }[];
    connections?: string[];
    tags?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "stack-new",
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      status: "DRAFT",
      environment: body.environment,
      layers: body.layers,
      connections: body.connections ?? [],
      version: 1,
      tags: body.tags ?? {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
