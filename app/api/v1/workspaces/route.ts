import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces:
 *   get:
 *     summary: List workspaces
 *     description: List workspaces with member counts and resource quotas
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create workspace
 *     description: Create a new workspace with region, quotas, and initial configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - region
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               region:
 *                 type: string
 *                 enum: [us-east-1, us-west-2, eu-west-1, ap-southeast-1]
 *               tier:
 *                 type: string
 *                 enum: [free, pro, enterprise]
 *               quotas:
 *                 type: object
 *                 properties:
 *                   maxClusters:
 *                     type: integer
 *                   maxPipelines:
 *                     type: integer
 *                   maxStorageGb:
 *                     type: integer
 *               settings:
 *                 type: object
 *                 properties:
 *                   defaultCatalog:
 *                     type: string
 *                   enableAuditLog:
 *                     type: boolean
 *                   ssoEnabled:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const regionFilter = searchParams.get("region");

  const workspaces = [
    {
      id: "ws-001",
      name: "acme-production",
      displayName: "ACME Production",
      region: "us-east-1",
      tier: "enterprise",
      memberCount: 24,
      quotas: { maxClusters: 50, maxPipelines: 200, maxStorageGb: 10000 },
      usage: { clusters: 8, pipelines: 45, storageGb: 3200 },
      settings: { defaultCatalog: "main", enableAuditLog: true, ssoEnabled: true },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-08-01T14:00:00Z",
    },
    {
      id: "ws-002",
      name: "acme-staging",
      displayName: "ACME Staging",
      region: "us-east-1",
      tier: "pro",
      memberCount: 12,
      quotas: { maxClusters: 10, maxPipelines: 50, maxStorageGb: 2000 },
      usage: { clusters: 3, pipelines: 18, storageGb: 450 },
      settings: { defaultCatalog: "staging", enableAuditLog: true, ssoEnabled: false },
      createdAt: "2024-02-01T10:00:00Z",
      updatedAt: "2024-07-15T09:00:00Z",
    },
  ];

  let filtered = workspaces;
  if (regionFilter) filtered = filtered.filter((w) => w.region === regionFilter);

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("workspaces", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    displayName?: string;
    region: string;
    tier?: string;
    quotas?: { maxClusters?: number; maxPipelines?: number; maxStorageGb?: number };
    settings?: { defaultCatalog?: string; enableAuditLog?: boolean; ssoEnabled?: boolean };
  };

  return created(
    {
      id: "ws-" + Date.now(),
      name: body.name,
      displayName: body.displayName ?? body.name,
      region: body.region,
      tier: body.tier ?? "free",
      memberCount: 1,
      quotas: {
        maxClusters: body.quotas?.maxClusters ?? 5,
        maxPipelines: body.quotas?.maxPipelines ?? 20,
        maxStorageGb: body.quotas?.maxStorageGb ?? 500,
      },
      usage: { clusters: 0, pipelines: 0, storageGb: 0 },
      settings: {
        defaultCatalog: body.settings?.defaultCatalog ?? "main",
        enableAuditLog: body.settings?.enableAuditLog ?? false,
        ssoEnabled: body.settings?.ssoEnabled ?? false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
