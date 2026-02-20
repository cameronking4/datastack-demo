import { NextRequest } from "next/server";
import {
  listResponse,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/activity:
 *   get:
 *     summary: List activity
 *     description: List recent activity across the workspace (runs, deployments, edits)
 *     parameters:
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 50 });
  const requestId = getRequestId(request);
  const resourceType = searchParams.get("resourceType");
  const action = searchParams.get("action");

  const activities = [
    {
      id: "act-001",
      resourceType: "job_run",
      resourceId: "run-1234",
      action: "completed",
      userId: "ada@datastack.dev",
      timestamp: "2024-06-10T09:15:00Z",
      metadata: { jobId: "1001", duration: 342 },
    },
    {
      id: "act-002",
      resourceType: "deployment",
      resourceId: "deploy-003",
      action: "promoted",
      userId: "ada@datastack.dev",
      timestamp: "2024-06-10T08:30:00Z",
      metadata: { stackId: "stack-001", environment: "PRODUCTION" },
    },
    {
      id: "act-003",
      resourceType: "query",
      resourceId: "q-001",
      action: "executed",
      userId: "bob@datastack.dev",
      timestamp: "2024-06-10T08:00:00Z",
      metadata: { warehouseId: "wh-001", rowCount: 1523 },
    },
    {
      id: "act-004",
      resourceType: "connection",
      resourceId: "conn-001",
      action: "tested",
      userId: "ada@datastack.dev",
      timestamp: "2024-06-09T16:45:00Z",
      metadata: { status: "SUCCESS" },
    },
    {
      id: "act-005",
      resourceType: "pipeline",
      resourceId: "pipe-001",
      action: "started",
      userId: "ada@datastack.dev",
      timestamp: "2024-06-09T14:00:00Z",
      metadata: {},
    },
  ];

  let filtered = activities;
  if (resourceType)
    filtered = filtered.filter((a) => a.resourceType === resourceType);
  if (action) filtered = filtered.filter((a) => a.action === action);
  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("activities", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}
