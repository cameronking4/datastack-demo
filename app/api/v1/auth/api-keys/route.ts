import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/api-keys:
 *   get:
 *     summary: List API keys
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create API key
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/auth/api-keys
 * List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  return NextResponse.json({
    apiKeys: [
      {
        id: "key-001",
        name: "CI/CD Pipeline Key",
        prefix: "dsk_live_abc",
        scopes: ["read:clusters", "manage:jobs"],
        expiresAt: "2025-06-01T00:00:00Z",
        createdAt: "2024-06-01T10:00:00Z",
        lastUsedAt: "2024-06-10T08:00:00Z",
        status: "ACTIVE",
      },
    ],
    totalCount: 1,
  });
}

/**
 * POST /api/v1/auth/api-keys
 * Create a new API key (full key returned only once)
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    scopes: string[];
    expiresInDays?: number;
  };
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (body.expiresInDays ?? 90));
  return NextResponse.json(
    {
      id: "key-new",
      name: body.name,
      key: "dsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      prefix: "dsk_live_xxx",
      scopes: body.scopes,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
