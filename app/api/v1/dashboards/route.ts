import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * GET /api/v1/dashboards
 * List saved dashboards (widget layouts).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);

  const dashboards = [
    {
      id: "dash-001",
      name: "Platform Overview",
      workspaceId: "ws-001",
      widgetCount: 6,
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-06-01T12:00:00Z",
      createdBy: "ada@datastack.dev",
    },
    {
      id: "dash-002",
      name: "ETL Health",
      workspaceId: "ws-001",
      widgetCount: 4,
      createdAt: "2024-05-15T14:00:00Z",
      updatedAt: "2024-05-20T09:00:00Z",
      createdBy: "bob@datastack.dev",
    },
  ];

  const totalCount = dashboards.length;
  const start = (page - 1) * pageSize;
  const paged = dashboards.slice(start, start + pageSize);

  return listResponse("dashboards", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

/**
 * POST /api/v1/dashboards
 * Create a new dashboard.
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { name: string; workspaceId: string };

  return created(
    {
      id: "dash-new",
      name: body.name,
      workspaceId: body.workspaceId,
      widgetCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
