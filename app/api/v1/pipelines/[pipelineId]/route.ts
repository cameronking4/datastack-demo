import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}:
 *   get:
 *     summary: Get pipeline
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete pipeline
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/pipelines/:pipelineId
 * Get pipeline by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  return NextResponse.json({
    id: pipelineId,
    name: "Bronze Ingestion",
    workspaceId: "ws-001",
    state: "RUNNING",
    target: "PRODUCTION",
    catalog: "main",
    schema: "bronze",
    continuous: true,
    photon: true,
    edition: "PRO",
    clusters: [
      {
        label: "default",
        nodeType: "i3.xlarge",
        workerCount: 4,
        enableAutoscaling: true,
      },
    ],
    createdAt: "2024-03-01T09:00:00Z",
    createdBy: "ada@datastack.dev",
    lastRunAt: "2024-06-10T02:00:00Z",
  });
}

/**
 * DELETE /api/v1/pipelines/:pipelineId
 * Delete pipeline
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  return NextResponse.json({
    message: `Pipeline ${pipelineId} deleted.`,
  });
}
