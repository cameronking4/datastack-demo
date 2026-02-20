import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_APPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/apps/{appId}/deploy:
 *   post:
 *     summary: Deploy app
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
 *               versionId:
 *                 type: string
 *               tag:
 *                 type: string
 *               env:
 *                 type: object
 *     responses:
 *       202:
 *         description: Accepted
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_APPS_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_APPS_HEADER);
  }
  const { appId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { versionId?: string; tag?: string; env?: Record<string, string> };

  return NextResponse.json(
    {
      appId,
      deploymentId: "dep-" + Date.now(),
      versionId: body.versionId ?? "ver-1",
      tag: body.tag ?? "v2.1.0",
      status: "DEPLOYING",
      url: "https://apps.datastack.dev/ws-001/revenue-dashboard",
      startedAt: new Date().toISOString(),
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}
