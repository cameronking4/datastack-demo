import { NextRequest, NextResponse } from "next/server";
import { getRequestId, ok } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_APPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/apps/{appId}:
 *   get:
 *     summary: Get app
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update app
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
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete app
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const { appId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      appId,
      name: "Revenue Dashboard",
      description: "Real-time revenue and cohort analytics",
      workspaceId: "ws-001",
      status: "RUNNING",
      currentVersion: "v2.1.0",
      url: "https://apps.datastack.dev/ws-001/revenue-dashboard",
      entrypoint: "index.html",
      env: { API_BASE: "https://api.datastack.dev" },
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-08-15T14:00:00Z",
      createdBy: "ada@datastack.dev",
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const { appId } = await params;
  const body = (await request.json()) as { name?: string; description?: string; env?: Record<string, string> };
  const requestId = getRequestId(request);

  return ok(
    {
      appId,
      name: body.name ?? "Revenue Dashboard",
      description: body.description ?? "Real-time revenue and cohort analytics",
      updatedAt: new Date().toISOString(),
      ...(body.env && { env: body.env }),
    },
    { requestId }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  await params;
  return new NextResponse(null, { status: 204 });
}
