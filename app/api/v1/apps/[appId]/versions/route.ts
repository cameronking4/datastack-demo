import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_APPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/apps/{appId}/versions:
 *   get:
 *     summary: List app versions
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
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
 *     summary: Create app version
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *               assets:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const { appId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 20 });
  const requestId = getRequestId(request);

  const versions = [
    { versionId: "ver-1", appId, tag: "v2.1.0", isActive: true, createdAt: "2024-08-15T14:00:00Z", createdBy: "ada@datastack.dev" },
    { versionId: "ver-2", appId, tag: "v2.0.0", isActive: false, createdAt: "2024-07-01T10:00:00Z", createdBy: "ada@datastack.dev" },
    { versionId: "ver-3", appId, tag: "v1.0.0", isActive: false, createdAt: "2024-04-01T10:00:00Z", createdBy: "ada@datastack.dev" },
  ];

  const totalCount = versions.length;
  const start = (page - 1) * pageSize;
  const paged = versions.slice(start, start + pageSize);

  return listResponse("versions", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const { appId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { tag: string; bundleUrl?: string; config?: Record<string, unknown> };

  return created(
    {
      versionId: "ver-" + Date.now(),
      appId,
      tag: body.tag ?? "v0.0.1",
      isActive: false,
      bundleUrl: body.bundleUrl ?? null,
      config: body.config ?? {},
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
