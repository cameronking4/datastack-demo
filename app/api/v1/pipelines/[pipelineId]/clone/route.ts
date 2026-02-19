import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * POST /api/v1/pipelines/{pipelineId}/clone
 * Clone a pipeline with a new name (copy configuration).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { name?: string };

  return created(
    {
      id: "pipe-clone",
      sourcePipelineId: pipelineId,
      name: body.name ?? `Clone of ${pipelineId}`,
      state: "IDLE",
      workspaceId: "ws-001",
      createdAt: new Date().toISOString(),
    },
    { requestId }
  );
}
