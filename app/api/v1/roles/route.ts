import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_RBAC_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");

  const roles = [
    {
      roleId: "role-001",
      name: "Workspace Admin",
      description: "Full workspace configuration and user management",
      workspaceId: "ws-001",
      permissions: ["workspace:read", "workspace:write", "users:manage", "billing:read"],
      isSystem: true,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-08-01T00:00:00Z",
    },
    {
      roleId: "role-002",
      name: "Data Engineer",
      description: "Pipelines, jobs, clusters, and catalog write",
      workspaceId: "ws-001",
      permissions: ["pipelines:read", "pipelines:write", "jobs:read", "jobs:write", "clusters:read", "clusters:write", "catalog:read", "catalog:write"],
      isSystem: false,
      createdAt: "2024-03-15T00:00:00Z",
      updatedAt: "2024-07-20T00:00:00Z",
    },
    {
      roleId: "role-003",
      name: "Analyst",
      description: "Read-only access to catalog and SQL warehouses",
      workspaceId: "ws-001",
      permissions: ["catalog:read", "sql:execute", "dashboards:read"],
      isSystem: false,
      createdAt: "2024-05-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    },
  ];

  let filtered = roles;
  if (workspaceId) filtered = filtered.filter((r) => r.workspaceId === workspaceId);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("roles", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    permissions: string[];
  };

  return created(
    {
      roleId: "role-" + Date.now(),
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      permissions: body.permissions ?? [],
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
