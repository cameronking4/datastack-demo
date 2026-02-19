import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/webhooks:
 *   get:
 *     summary: List webhooks
 *     description: List registered webhooks with delivery stats
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create webhook
 *     description: Register a new webhook endpoint with event subscriptions and retry configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - events
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
 *               contentType:
 *                 type: string
 *                 enum: [application/json, application/x-www-form-urlencoded]
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  return NextResponse.json({
    webhooks: [
      {
        id: "wh-001",
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
      },
    ],
    totalCount: 1,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    url: string;
    events: string[];
    signingSecret?: string;
    signingAlgorithm?: string;
    active?: boolean;
    headers?: Record<string, string>;
    retryPolicy?: { maxRetries: number; retryIntervalSeconds: number; exponentialBackoff: boolean };
    contentType?: string;
  };
  return NextResponse.json(
    {
      id: "wh-new",
      url: body.url,
      events: body.events,
      signingAlgorithm: body.signingAlgorithm ?? "HMAC_SHA256",
      active: body.active ?? true,
      headers: body.headers ?? {},
      retryPolicy: body.retryPolicy ?? { maxRetries: 3, retryIntervalSeconds: 60, exponentialBackoff: true },
      contentType: body.contentType ?? "application/json",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryStats: {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        lastDeliveryAt: null,
        lastDeliveryStatus: null,
      },
    },
    { status: 201 }
  );
}
