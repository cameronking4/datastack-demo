import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/queries:
 *   get:
 *     summary: List queries
 *     description: List saved SQL queries with optional filters
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create query
 *     description: Save a new SQL query with catalog/schema context and result format preferences
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - warehouseId
 *               - queryText
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               queryText:
 *                 type: string
 *               catalog:
 *                 type: string
 *               schema:
 *                 type: string
 *               resultFormat:
 *                 type: string
 *                 enum: [JSON, CSV, ARROW]
 *               timeout:
 *                 type: integer
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     defaultValue:
 *                       type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 25 });
  const requestId = getRequestId(request);
  const warehouseId = searchParams.get("warehouseId");
  const ownerId = searchParams.get("ownerId");
  const tag = searchParams.get("tag");

  const queries = [
    {
        id: "q-001",
        name: "Daily Active Users",
        description: "Count DAU by platform",
        warehouseId: "wh-001",
        queryText: "SELECT platform, COUNT(DISTINCT user_id) AS dau FROM events WHERE event_date = CURRENT_DATE GROUP BY platform",
        catalog: "main",
        schema: "analytics",
        resultFormat: "JSON",
        timeout: 300,
        parameters: [],
        tags: ["analytics", "daily"],
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
        createdBy: "ada@datastack.dev",
        lastExecutedAt: "2024-06-10T09:00:00Z",
        executionCount: 180,
      },
    ];

  let filtered = queries;
  if (warehouseId) filtered = filtered.filter((q) => q.warehouseId === warehouseId);
  if (ownerId) filtered = filtered.filter((q) => q.createdBy === ownerId);
  if (tag) filtered = filtered.filter((q) => q.tags?.includes(tag));
  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("queries", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    name: string;
    description?: string;
    warehouseId: string;
    queryText: string;
    catalog?: string;
    schema?: string;
    resultFormat?: string;
    timeout?: number;
    parameters?: { name: string; type: string; defaultValue: string }[];
    tags?: string[];
  };
  return created(
    {
      id: "q-new",
      name: body.name,
      description: body.description ?? "",
      warehouseId: body.warehouseId,
      queryText: body.queryText,
      catalog: body.catalog ?? null,
      schema: body.schema ?? null,
      resultFormat: body.resultFormat ?? "JSON",
      timeout: body.timeout ?? 300,
      parameters: body.parameters ?? [],
      tags: body.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
