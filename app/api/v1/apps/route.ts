import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_APPS_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const status = searchParams.get("status");

  const apps = [
    {
      appId: "app-001",
      name: "Revenue Dashboard",
      description: "Real-time revenue and cohort analytics",
      workspaceId: "ws-001",
      status: "RUNNING",
      currentVersion: "v2.1.0",
      url: "https://apps.datastack.dev/ws-001/revenue-dashboard",
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-08-15T14:00:00Z",
      createdBy: "ada@datastack.dev",
    },
    {
      appId: "app-002",
      name: "Data Quality Monitor",
      description: "Table health and DQ rule status",
      workspaceId: "ws-001",
      status: "STOPPED",
      currentVersion: "v1.0.0",
      url: null,
      createdAt: "2024-05-10T00:00:00Z",
      updatedAt: "2024-07-01T00:00:00Z",
      createdBy: "bob@datastack.dev",
    },
  ];

  let filtered = apps;
  if (workspaceId) filtered = filtered.filter((a) => a.workspaceId === workspaceId);
  if (status) filtered = filtered.filter((a) => a.status === status);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("apps", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    entrypoint?: string;
  };

  return created(
    {
      appId: "app-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      status: "DRAFT",
      currentVersion: null,
      url: null,
      entrypoint: body.entrypoint ?? "index.html",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
