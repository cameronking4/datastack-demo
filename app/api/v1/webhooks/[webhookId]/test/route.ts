import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/webhooks/{webhookId}/test:
 *   post:
 *     summary: Test webhook
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
 * POST /api/v1/webhooks/:webhookId/test
 * Send test payload to webhook URL
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  return NextResponse.json({
    id: "del-test-001",
    webhookId,
    event: "test.ping",
    requestUrl: "https://example.com/hooks/datastack",
    responseStatus: 200,
    success: true,
    duration: 120,
    timestamp: new Date().toISOString(),
  });
}
