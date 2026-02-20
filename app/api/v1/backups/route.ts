import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * GET /api/v1/backups
 * List workspace backups with optional filters.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const status = searchParams.get("status");

  const backups = [
    {
      backupId: "backup-001",
      workspaceId: "ws-001",
      type: "full",
      status: "completed",
      sizeBytes: 10737418240,
      startedAt: "2024-06-09T22:00:00Z",
      completedAt: "2024-06-10T01:30:00Z",
      retentionUntil: "2024-07-10T01:30:00Z",
    },
    {
      backupId: "backup-002",
      workspaceId: "ws-001",
      type: "incremental",
      status: "completed",
      sizeBytes: 536870912,
      startedAt: "2024-06-10T22:00:00Z",
      completedAt: "2024-06-10T22:15:00Z",
      retentionUntil: "2024-07-10T22:15:00Z",
    },
  ];

  let filtered = backups;
  if (workspaceId) filtered = filtered.filter((b) => b.workspaceId === workspaceId);
  if (status) filtered = filtered.filter((b) => b.status === status);
  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("backups", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}

/**
 * POST /api/v1/backups
 * Create a new backup for a workspace.
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    workspaceId: string;
    type?: "full" | "incremental";
    retentionDays?: number;
  };

  return created(
    {
      backupId: "backup-" + Date.now(),
      workspaceId: body.workspaceId,
      type: body.type ?? "full",
      status: "pending",
      startedAt: new Date().toISOString(),
      completedAt: null,
      retentionUntil: null,
    },
    { requestId }
  );
}
