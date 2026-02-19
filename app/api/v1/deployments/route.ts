import { NextRequest } from "next/server";
import {
  listResponse,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

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
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const stackId = searchParams.get("stackId");
  const environment = searchParams.get("environment");
  const status = searchParams.get("status");

  const deployments = [
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
    ];

  let filtered = deployments;
  if (stackId) filtered = filtered.filter((d) => d.stackId === stackId);
  if (environment) filtered = filtered.filter((d) => d.environment === environment);
  if (status) filtered = filtered.filter((d) => d.status === status);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("deployments", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
