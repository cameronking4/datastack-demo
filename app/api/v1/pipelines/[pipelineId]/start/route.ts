import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/start:
 *   post:
 *     summary: Start pipeline
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/pipelines/:pipelineId/start
 * Start pipeline (trigger update)
 */
export async function POST(
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
    clusters: [],
    createdAt: "2024-03-01T09:00:00Z",
    createdBy: "ada@datastack.dev",
    lastRunAt: new Date().toISOString(),
  });
}
