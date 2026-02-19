import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/events:
 *   get:
 *     summary: List pipeline events
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
 * GET /api/v1/pipelines/:pipelineId/events
 * List pipeline run events
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  return NextResponse.json({
    events: [
      {
        id: "evt-001",
        pipelineId,
        eventType: "STARTED",
        message: "Pipeline update started",
        timestamp: "2024-06-10T02:00:00Z",
      },
      {
        id: "evt-002",
        pipelineId,
        eventType: "COMPLETED",
        message: "Pipeline update completed successfully",
        timestamp: "2024-06-10T02:15:33Z",
      },
    ],
    totalCount: 2,
  });
}
