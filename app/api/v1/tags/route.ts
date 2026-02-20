import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/tags:
 *   get:
 *     summary: List tags
 *     description: List tags used across the workspace (tag taxonomy)
 *     parameters:
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create tag
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
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
