import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/favorites:
 *   get:
 *     summary: List favorites
 *     description: List the caller's favorited resources (queries, clusters, pipelines, etc)
 *     parameters:
 *       - in: query
 *         name: resourceType
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
 *     summary: Add favorite
 *     description: Add a resource to favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceType
 *               - resourceId
 *             properties:
 *               resourceType:
 *                 type: string
 *               resourceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const resourceType = searchParams.get("resourceType");

  const favorites = [
    {
      id: "fav-001",
      resourceType: "query",
      resourceId: "q-001",
      resourceName: "Daily Active Users",
      addedAt: "2024-05-15T10:00:00Z",
    },
    {
      id: "fav-002",
      resourceType: "pipeline",
      resourceId: "pipe-001",
      resourceName: "Bronze Ingestion",
      addedAt: "2024-05-20T14:30:00Z",
    },
    {
      id: "fav-003",
      resourceType: "cluster",
      resourceId: "cluster-001",
      resourceName: "Analytics Cluster",
      addedAt: "2024-06-01T09:00:00Z",
    },
  ];

  const filtered = resourceType
    ? favorites.filter((f) => f.resourceType === resourceType)
    : favorites;
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("favorites", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    resourceType: string;
    resourceId: string;
  };

  return created(
    {
      id: "fav-new",
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      addedAt: new Date().toISOString(),
    },
    { requestId }
  );
}
