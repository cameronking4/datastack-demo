import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/webhooks/{webhookId}:
 *   get:
 *     summary: Get webhook
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update webhook
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete webhook
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
/**
 * GET /api/v1/webhooks/:webhookId
 * Get webhook by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  return NextResponse.json({
    id: webhookId,
    url: "https://example.com/hooks/datastack",
    events: ["job.completed", "job.failed"],
    active: true,
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    lastTriggeredAt: "2024-06-10T02:15:33Z",
    failureCount: 0,
  });
}

/**
 * PATCH /api/v1/webhooks/:webhookId
 * Update webhook
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  return NextResponse.json({
    id: webhookId,
    url: "https://example.com/hooks/datastack",
    events: ["job.completed", "job.failed"],
    active: true,
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: new Date().toISOString(),
    failureCount: 0,
  });
}

/**
 * DELETE /api/v1/webhooks/:webhookId
 * Delete webhook
 */
export async function DELETE() {
  return new NextResponse(null, { status: 204 });
}
