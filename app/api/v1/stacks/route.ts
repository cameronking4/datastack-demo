import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks:
 *   get:
 *     summary: List stacks
 *     description: List composable infrastructure stacks with version and lock state
 *     parameters:
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: [development, staging, production]
 *       - in: query
 *         name: lockState
 *         schema:
 *           type: string
 *           enum: [LOCKED, UNLOCKED]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create stack
 *     description: Create a new composable infrastructure stack with versioning
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workspaceId
 *               - environment
 *               - layers
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *               version:
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
 *                     dependsOn:
 *                       type: array
 *                       items:
 *                         type: string
 *                     healthCheck:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                         endpoint:
 *                           type: string
 *                         intervalSeconds:
 *                           type: integer
 *               connections:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               autoDeployOnPush:
 *                 type: boolean
 *               gitRepository:
 *                 type: string
 *               gitBranch:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  return NextResponse.json({
    stacks: [
      {
        id: "stack-001",
        name: "Analytics Platform",
        description: "End-to-end analytics pipeline",
        workspaceId: "ws-001",
        environment: "production",
        version: "2.4.1",
        lockState: "UNLOCKED",
        lockedBy: null,
        lockedAt: null,
        layers: [
          { name: "Storage", resourceType: "catalog", resourceId: "cat-001", order: 1, dependsOn: [] },
          { name: "Ingestion", resourceType: "pipeline", resourceId: "pipe-001", order: 2, dependsOn: ["Storage"] },
          { name: "Transform", resourceType: "job", resourceId: "job-1001", order: 3, dependsOn: ["Ingestion"] },
        ],
        connections: ["conn-001", "conn-002"],
        tags: { team: "platform", tier: "critical" },
        autoDeployOnPush: true,
        gitRepository: "https://github.com/acme/analytics-stack",
        gitBranch: "main",
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-06-05T14:00:00Z",
        lastDeployedAt: "2024-06-05T14:30:00Z",
        lastDeployStatus: "SUCCESS",
      },
    ],
    totalCount: 1,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    environment: string;
    version?: string;
    layers: Record<string, unknown>[];
    connections?: string[];
    tags?: Record<string, string>;
    autoDeployOnPush?: boolean;
    gitRepository?: string;
    gitBranch?: string;
  };
  return NextResponse.json(
    {
      id: "stack-new",
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      environment: body.environment,
      version: body.version ?? "1.0.0",
      lockState: "UNLOCKED",
      lockedBy: null,
      lockedAt: null,
      layers: body.layers,
      connections: body.connections ?? [],
      tags: body.tags ?? {},
      autoDeployOnPush: body.autoDeployOnPush ?? false,
      gitRepository: body.gitRepository ?? null,
      gitBranch: body.gitBranch ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
