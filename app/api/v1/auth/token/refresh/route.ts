import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/token/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Exchange a refresh token for a new access token without re-authenticating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Invalid or expired refresh token
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { refreshToken: string; scopes?: string[] };
  return NextResponse.json({
    accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.refreshed...",
    tokenType: "Bearer",
    expiresIn: 3600,
    refreshToken: "dGhpcyBpcyBhIG5ldyByZWZyZXNoIHRva2Vu...",
    scope: (body.scopes ?? ["read"]).join(" "),
    issuedAt: new Date().toISOString(),
  });
}
