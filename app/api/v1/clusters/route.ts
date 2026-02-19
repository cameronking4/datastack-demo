import { NextRequest } from "next/server";
import { isPreviewEnabled } from "@/lib/api/preview";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/clusters:
 *   get:
 *     summary: List clusters
 *     description: List clusters in workspace with optional state and tag filters
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [RUNNING, PENDING, TERMINATED, ERROR, RESIZING]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, state, numWorkers]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: tagFilter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create cluster
 *     description: Create a new compute cluster with autoscaling, spot instances, and custom configurations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workspaceId
 *               - runtimeVersion
 *               - nodeType
 *             properties:
 *               name:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               runtimeVersion:
 *                 type: string
 *               nodeType:
 *                 type: string
 *               driverNodeType:
 *                 type: string
 *               numWorkers:
 *                 type: integer
 *               enableAutoscaling:
 *                 type: boolean
 *               minWorkers:
 *                 type: integer
 *               maxWorkers:
 *                 type: integer
 *               autoTerminationMinutes:
 *                 type: integer
 *               spotInstances:
 *                 type: boolean
 *               spotFallbackToOnDemand:
 *                 type: boolean
 *               instancePoolId:
 *                 type: string
 *               clusterPolicyId:
 *                 type: string
 *               runtimeEngine:
 *                 type: string
 *                 enum: [STANDARD, PHOTON]
 *               initScripts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     workspace:
 *                       type: object
 *                       properties:
 *                         destination:
 *                           type: string
 *               customSparkConf:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               sshPublicKeys:
 *                 type: array
 *                 items:
 *                   type: string
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
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const state = searchParams.get("state");
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const clusters = [
    {
      id: "cluster-001",
        name: "Analytics Cluster",
        clusterSize: "Medium",
        region: "us-east-1",
        state: "RUNNING",
        runtimeVersion: "14.3.x-scala2.12",
        nodeType: "i3.xlarge",
        driverNodeType: "i3.xlarge",
        numWorkers: 4,
        autoTerminationMinutes: 120,
        spotInstances: false,
        runtimeEngine: "PHOTON",
        clusterPolicyId: "policy-default",
        createdAt: "2024-03-01T09:00:00Z",
        lastActivityAt: "2024-06-10T08:00:00Z",
      },
      {
        id: "cluster-002",
        name: "ETL Jobs",
        clusterSize: "Large",
        region: "us-west-2",
        state: "RUNNING",
        runtimeVersion: "14.3.x-scala2.12",
        nodeType: "r5.2xlarge",
        driverNodeType: "r5.xlarge",
        numWorkers: 8,
        autoTerminationMinutes: 0,
        spotInstances: true,
        spotFallbackToOnDemand: true,
        runtimeEngine: "STANDARD",
        clusterPolicyId: "policy-etl",
        createdAt: "2024-03-15T14:00:00Z",
        lastActivityAt: "2024-06-10T07:30:00Z",
      },
    ];

  let filtered = state ? clusters.filter((c) => c.state === state) : clusters;
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("clusters", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const preview = isPreviewEnabled(request);
  const body = (await request.json()) as {
    name: string;
    workspaceId: string;
    runtimeVersion: string;
    nodeType: string;
    driverNodeType?: string;
    numWorkers?: number;
    enableAutoscaling?: boolean;
    minWorkers?: number;
    maxWorkers?: number;
    autoTerminationMinutes?: number;
    spotInstances?: boolean;
    spotFallbackToOnDemand?: boolean;
    instancePoolId?: string;
    clusterPolicyId?: string;
    runtimeEngine?: string;
    initScripts?: { workspace: { destination: string } }[];
    customSparkConf?: Record<string, string>;
    sshPublicKeys?: string[];
    tags?: Record<string, string>;
  };

  const requestId = getRequestId(request);
  const response: Record<string, unknown> = {
    id: "cluster-new",
    name: body.name,
    workspaceId: body.workspaceId,
    clusterSize: "Medium",
    region: "us-east-1",
    state: "PENDING",
    runtimeVersion: body.runtimeVersion,
    nodeType: body.nodeType,
    driverNodeType: body.driverNodeType ?? body.nodeType,
    numWorkers: body.numWorkers ?? 2,
    enableAutoscaling: body.enableAutoscaling ?? false,
    minWorkers: body.minWorkers ?? 1,
    maxWorkers: body.maxWorkers ?? 8,
    autoTerminationMinutes: body.autoTerminationMinutes ?? 120,
    spotInstances: body.spotInstances ?? false,
    spotFallbackToOnDemand: body.spotFallbackToOnDemand ?? true,
    instancePoolId: body.instancePoolId ?? null,
    clusterPolicyId: body.clusterPolicyId ?? null,
    runtimeEngine: body.runtimeEngine ?? "STANDARD",
    initScripts: body.initScripts ?? [],
    customSparkConf: body.customSparkConf ?? {},
    sshPublicKeys: body.sshPublicKeys ?? [],
    tags: body.tags ?? {},
    createdAt: new Date().toISOString(),
    createdBy: "api",
  };

  return created(response as Record<string, unknown>, { requestId });
}
