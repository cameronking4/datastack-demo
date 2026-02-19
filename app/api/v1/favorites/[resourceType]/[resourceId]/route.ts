import { NextRequest } from "next/server";
import { noContent, getRequestId } from "@/lib/api/response";

/**
 * DELETE /api/v1/favorites/{resourceType}/{resourceId}
 * Remove a resource from favorites.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  const { resourceType, resourceId } = await params;
  return noContent({ requestId: getRequestId(request) });
}
