import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * POST /api/v1/queries/{queryId}/clone
 * Clone a saved query with a new name.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { name?: string };

  return created(
    {
      id: "q-clone",
      sourceQueryId: queryId,
      name: body.name ?? `Copy of query`,
      warehouseId: "wh-001",
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
