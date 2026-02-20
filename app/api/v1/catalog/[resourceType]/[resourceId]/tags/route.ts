import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/catalog/{resourceType}/{resourceId}/tags:
 *   put:
 *     summary: Update resource tags
 *     description: Set or update tags on a catalog resource
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const { resourceType, resourceId } = await params;
  const body = (await request.json()) as {
    tags?: string[];
  };

  return NextResponse.json({
    resourceType,
    resourceId,
    tags: body.tags ?? ["production", "verified"],
    updatedAt: new Date().toISOString(),
    updatedBy: "api",
  });
}
