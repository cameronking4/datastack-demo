import { NextRequest } from "next/server";
import {
  listResponse,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/templates:
 *   get:
 *     summary: List workspace templates
 *     description: List reusable templates available in the workspace
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
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
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 20 });
  const requestId = getRequestId(request);
  const category = searchParams.get("category");

  const templates = [
    {
      templateId: "tpl-001",
      name: "Delta Lake Bronze Table",
      description: "Standard bronze ingestion template with schema evolution",
      category: "pipeline",
      workspaceId,
      createdAt: "2024-05-01T10:00:00Z",
      usageCount: 142,
    },
    {
      templateId: "tpl-002",
      name: "Streaming Checkpoint",
      description: "Structured streaming checkpoint configuration",
      category: "stream",
      workspaceId,
      createdAt: "2024-05-15T14:00:00Z",
      usageCount: 89,
    },
  ];

  let filtered = templates;
  if (category) filtered = filtered.filter((t) => t.category === category);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("templates", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
