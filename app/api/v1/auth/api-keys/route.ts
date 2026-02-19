import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/api-keys:
 *   get:
 *     summary: List API keys
 *     description: List API keys with usage statistics and expiration info
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, expired, revoked]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create API key
 *     description: Create a new API key with scopes, expiration, and rate limiting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - scopes
 *             properties:
 *               name:
 *                 type: string
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresInDays:
 *                 type: integer
 *               rateLimit:
 *                 type: object
 *                 properties:
 *                   requestsPerMinute:
 *                     type: integer
 *                   requestsPerDay:
 *                     type: integer
 *               rotationPolicy:
 *                 type: object
 *                 properties:
 *                   autoRotate:
 *                     type: boolean
 *                   rotationIntervalDays:
 *                     type: integer
 *               allowedIpRanges:
 *                 type: array
 *                 items:
 *                   type: string
 *               metadata:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    apiKeys: [
      {
        id: "key-001",
        name: "Production API Key",
        prefix: "dsk_prod_****",
        scopes: ["clusters:read", "jobs:read", "pipelines:read"],
        status: "active",
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 10000 },
        rotationPolicy: { autoRotate: true, rotationIntervalDays: 90 },
        allowedIpRanges: ["10.0.0.0/8"],
        createdAt: "2024-01-15T10:00:00Z",
        expiresAt: "2025-01-15T10:00:00Z",
        lastUsedAt: "2024-06-10T08:00:00Z",
        usageCount: 15420,
      },
    ],
    totalCount: 1,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    scopes: string[];
    expiresInDays?: number;
    rateLimit?: { requestsPerMinute: number; requestsPerDay: number };
    rotationPolicy?: { autoRotate: boolean; rotationIntervalDays: number };
    allowedIpRanges?: string[];
    metadata?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "key-new",
      name: body.name,
      key: "dsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      prefix: "dsk_live_****",
      scopes: body.scopes,
      status: "active",
      rateLimit: body.rateLimit ?? { requestsPerMinute: 60, requestsPerDay: 5000 },
      rotationPolicy: body.rotationPolicy ?? { autoRotate: false, rotationIntervalDays: 0 },
      allowedIpRanges: body.allowedIpRanges ?? [],
      metadata: body.metadata ?? {},
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresInDays
        ? new Date(Date.now() + body.expiresInDays * 86400000).toISOString()
        : null,
    },
    { status: 201 }
  );
}
