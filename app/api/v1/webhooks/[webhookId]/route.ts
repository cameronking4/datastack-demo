import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/webhooks/{webhookId}:
 *   get:
 *     summary: Get webhook
 *     description: Get webhook configuration and delivery statistics
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
 *     description: Update webhook URL, events, retry policy, or signing configuration
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *               signingSecret:
 *                 type: string
 *               signingAlgorithm:
 *                 type: string
 *                 enum: [HMAC_SHA256, HMAC_SHA512]
 *               active:
 *                 type: boolean
 *               headers:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               retryPolicy:
 *                 type: object
 *                 properties:
 *                   maxRetries:
 *                     type: integer
 *                   retryIntervalSeconds:
 *                     type: integer
 *                   exponentialBackoff:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete webhook
 *     description: Unregister a webhook endpoint
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
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  return NextResponse.json({
    id: webhookId,
    url: "https://hooks.acme.dev/datastack",
    events: ["job.completed", "job.failed", "pipeline.failed"],
    signingAlgorithm: "HMAC_SHA256",
    active: true,
    headers: { "X-Source": "datastack" },
    retryPolicy: { maxRetries: 3, retryIntervalSeconds: 60, exponentialBackoff: true },
    contentType: "application/json",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-05-20T14:00:00Z",
    deliveryStats: {
      totalDeliveries: 1250,
      successfulDeliveries: 1240,
      failedDeliveries: 10,
      lastDeliveryAt: "2024-06-10T08:00:00Z",
      lastDeliveryStatus: "SUCCESS",
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const { webhookId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: webhookId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
