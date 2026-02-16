import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/deployments:
 *   get:
 *     summary: List deployments
 *     description: List all stack deployments across environments
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/deployments
 * List all stack deployments across environments
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    deployments: [
      {
        id: "deploy-003",
        stackId: "stack-001",
        stackName: "Analytics Platform",
        version: 3,
        environment: "PRODUCTION",
        status: "SUCCEEDED",
        layersDeployed: 4,
        layersFailed: 0,
        startedAt: "2024-06-10T08:00:00Z",
        completedAt: "2024-06-10T08:05:33Z",
        startedBy: "ada@datastack.dev",
        promotedFrom: "deploy-002",
      },
      {
        id: "deploy-002",
        stackId: "stack-001",
        stackName: "Analytics Platform",
        version: 2,
        environment: "STAGING",
        status: "SUCCEEDED",
        layersDeployed: 3,
        layersFailed: 0,
        startedAt: "2024-05-15T10:00:00Z",
        completedAt: "2024-05-15T10:03:12Z",
        startedBy: "ada@datastack.dev",
        promotedFrom: null,
      },
      {
        id: "deploy-004",
        stackId: "stack-002",
        stackName: "ML Feature Store",
        version: 1,
        environment: "DEVELOPMENT",
        status: "IN_PROGRESS",
        layersDeployed: 1,
        layersFailed: 0,
        startedAt: "2024-06-10T10:00:00Z",
        completedAt: null,
        startedBy: "bob@datastack.dev",
        promotedFrom: null,
      },
    ],
    totalCount: 3,
    page,
    pageSize,
  });
}
