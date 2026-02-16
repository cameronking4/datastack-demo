import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/webhooks/{webhookId}/deliveries:
 *   get:
 *     summary: List webhook deliveries
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/webhooks/:webhookId/deliveries
 * List webhook delivery attempts
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  return NextResponse.json({
    deliveries: [
      {
        id: "del-001",
        webhookId,
        event: "job.completed",
        requestUrl: "https://example.com/hooks/datastack",
        responseStatus: 200,
        success: true,
        duration: 85,
        timestamp: "2024-06-10T02:15:33Z",
      },
    ],
    totalCount: 1,
  });
}
