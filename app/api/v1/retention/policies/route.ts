import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const targetType = searchParams.get("targetType");

  const policies = [
    {
      policyId: "ret-001",
      name: "Raw Events 90d",
      description: "Retain raw event tables for 90 days then archive",
      workspaceId: "ws-001",
      targetType: "TABLE",
      targetPattern: "main.raw_events.*",
      retentionDays: 90,
      action: "ARCHIVE",
      enabled: true,
      lastRunAt: "2024-08-18T03:00:00Z",
      createdAt: "2024-03-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    },
    {
      policyId: "ret-002",
      name: "Temp Tables 7d",
      description: "Drop temp tables older than 7 days",
      workspaceId: "ws-001",
      targetType: "TABLE",
      targetPattern: "main.temp.*",
      retentionDays: 7,
      action: "DELETE",
      enabled: true,
      lastRunAt: "2024-08-19T02:00:00Z",
      createdAt: "2024-05-10T00:00:00Z",
      updatedAt: "2024-05-10T00:00:00Z",
    },
  ];

  let filtered = policies;
  if (workspaceId) filtered = filtered.filter((p) => p.workspaceId === workspaceId);
  if (targetType) filtered = filtered.filter((p) => p.targetType === targetType);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("policies", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    targetType: string;
    targetPattern: string;
    retentionDays: number;
    action: string;
  };

  return created(
    {
      policyId: "ret-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      targetType: body.targetType,
      targetPattern: body.targetPattern,
      retentionDays: body.retentionDays,
      action: body.action ?? "ARCHIVE",
      enabled: true,
      lastRunAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
