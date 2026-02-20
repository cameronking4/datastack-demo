import { NextRequest } from "next/server";
import { noContent, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/favorites/{resourceType}/{resourceId}:
 *   delete:
 *     summary: Remove favorite
 *     description: Remove a resource from favorites
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
 *     responses:
 *       204:
 *         description: No content
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  const { resourceType, resourceId } = await params;
  return noContent({ requestId: getRequestId(request) });
}
