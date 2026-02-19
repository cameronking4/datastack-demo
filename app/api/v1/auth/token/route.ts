import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/token:
 *   post:
 *     summary: Get access token
 *     description: Exchange credentials for access token (OAuth2 client_credentials or refresh_token grant)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grantType
 *             properties:
 *               grantType:
 *                 type: string
 *                 enum: [client_credentials, refresh_token]
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *               refreshToken:
 *                 type: string
 *               audience:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    grantType: string;
    scopes?: string[];
    refreshToken?: string;
    audience?: string;
  };
  return NextResponse.json({
    accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    tokenType: "Bearer",
    expiresIn: 3600,
    refreshToken: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    scope: (body.scopes ?? ["read"]).join(" "),
    issuedAt: new Date().toISOString(),
  });
}
