import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/catalog/{resourceType}/{resourceId}/annotations:
 *   post:
 *     summary: Add annotation
 *     description: Add an annotation to a catalog resource
 *     parameters:
 *       - in: path
 *         name: resourceType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const { resourceType, resourceId } = await params;
  const body = (await request.json()) as {
    content?: string;
    type?: string;
  };

  return NextResponse.json(
    {
      annotationId: "ann-" + Date.now(),
      resourceType,
      resourceId,
      content: body.content ?? "",
      type: body.type ?? "DOCUMENTATION",
      author: "api",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
