import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * GET /api/v1/tags
 * List tags used across the workspace (tag taxonomy).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 50 });
  const requestId = getRequestId(request);
  const prefix = searchParams.get("prefix");

  const tags = [
    { key: "team", value: "platform", resourceCount: 12 },
    { key: "team", value: "analytics", resourceCount: 8 },
    { key: "env", value: "production", resourceCount: 15 },
    { key: "env", value: "staging", resourceCount: 6 },
    { key: "tier", value: "critical", resourceCount: 5 },
    { key: "project", value: "revenue-analytics", resourceCount: 3 },
  ];

  const filtered = prefix
    ? tags.filter((t) => t.key.startsWith(prefix) || t.value.startsWith(prefix))
    : tags;
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("tags", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

/**
 * POST /api/v1/tags
 * Create or register a tag key-value (for taxonomy).
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { key: string; value: string };

  return created(
    {
      key: body.key,
      value: body.value,
      resourceCount: 0,
      createdAt: new Date().toISOString(),
    },
    { requestId }
  );
}
