import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/clone:
 *   post:
 *     summary: Clone pipeline
 *     description: Clone a pipeline with a new name (copy configuration)
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
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
