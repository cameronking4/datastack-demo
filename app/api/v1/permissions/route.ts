import { NextRequest } from "next/server";
import { listResponse, parsePagePagination, getRequestId } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_RBAC_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 50 });
  const requestId = getRequestId(request);
  const scope = searchParams.get("scope");

  const permissions = [
    { id: "perm-workspace-read", scope: "workspace", name: "workspace:read", description: "View workspace settings and metadata" },
    { id: "perm-workspace-write", scope: "workspace", name: "workspace:write", description: "Modify workspace settings" },
    { id: "perm-users-manage", scope: "workspace", name: "users:manage", description: "Invite and manage workspace users" },
    { id: "perm-pipelines-read", scope: "workspace", name: "pipelines:read", description: "View pipelines and runs" },
    { id: "perm-pipelines-write", scope: "workspace", name: "pipelines:write", description: "Create and edit pipelines" },
    { id: "perm-jobs-read", scope: "workspace", name: "jobs:read", description: "View jobs and run history" },
    { id: "perm-jobs-write", scope: "workspace", name: "jobs:write", description: "Create and edit jobs" },
    { id: "perm-clusters-read", scope: "workspace", name: "clusters:read", description: "View cluster configuration" },
    { id: "perm-clusters-write", scope: "workspace", name: "clusters:write", description: "Create and terminate clusters" },
    { id: "perm-catalog-read", scope: "catalog", name: "catalog:read", description: "Browse catalog and lineage" },
    { id: "perm-catalog-write", scope: "catalog", name: "catalog:write", description: "Register and update catalog assets" },
    { id: "perm-sql-execute", scope: "workspace", name: "sql:execute", description: "Run queries on SQL warehouses" },
    { id: "perm-dashboards-read", scope: "workspace", name: "dashboards:read", description: "View dashboards" },
    { id: "perm-billing-read", scope: "account", name: "billing:read", description: "View billing and usage" },
  ];

  let filtered = permissions;
  if (scope) filtered = filtered.filter((p) => p.scope === scope);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("permissions", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
