import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/token:
 *   post:
 *     summary: Get access token
 *     description: Exchange credentials for access token (OAuth2 client_credentials grant)
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/auth/token
 * Exchange credentials for access token (OAuth2 client_credentials grant)
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    grantType?: string;
    scopes?: string[];
  };
  return NextResponse.json({
    accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.demo-token",
    refreshToken: "drt_refresh_demo_token",
    tokenType: "Bearer",
    expiresIn: 3600,
    scopes: body.scopes ?? ["read:users", "read:workspaces"],
  });
}
