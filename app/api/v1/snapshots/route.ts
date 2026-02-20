import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/snapshots:
 *   get:
 *     summary: List snapshots
 *     description: List table or volume snapshots with optional workspace and type filters
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [table, volume]
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
 *   post:
 *     summary: Create snapshot
 *     description: Create a new table or volume snapshot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *               - resourceType
 *               - resourceId
 *             properties:
 *               workspaceId:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [table, volume]
 *               resourceId:
 *                 type: string
 *               name:
 *                 type: string
 *               retentionDays:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const type = searchParams.get("type");

  const snapshots = [
    {
      snapshotId: "snap-001",
      workspaceId: "ws-001",
      type: "table",
      resourceId: "main.schema.events",
      name: "events-pre-migration",
      sizeBytes: 2147483648,
      createdAt: "2024-06-08T00:00:00Z",
      retentionUntil: "2024-07-08T00:00:00Z",
      status: "available",
    },
    {
      snapshotId: "snap-002",
      workspaceId: "ws-001",
      type: "volume",
      resourceId: "vol-abc-001",
      name: "bronze-volume-daily",
      sizeBytes: 10737418240,
      createdAt: "2024-06-10T02:00:00Z",
      retentionUntil: "2024-07-10T02:00:00Z",
      status: "available",
    },
  ];

  let filtered = snapshots;
  if (workspaceId) filtered = filtered.filter((s) => s.workspaceId === workspaceId);
  if (type) filtered = filtered.filter((s) => s.type === type);
  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("snapshots", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    workspaceId: string;
    resourceType: "table" | "volume";
    resourceId: string;
    name?: string;
    retentionDays?: number;
  };

  return created(
    {
      snapshotId: "snap-" + Date.now(),
      workspaceId: body.workspaceId,
      type: body.resourceType,
      resourceId: body.resourceId,
      name: body.name ?? `snapshot-${body.resourceId}`,
      status: "creating",
      createdAt: new Date().toISOString(),
      retentionUntil: null,
    },
    { requestId }
  );
}
