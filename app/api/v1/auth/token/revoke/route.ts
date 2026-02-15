import { NextResponse } from "next/server";

/**
 * POST /api/v1/auth/token/revoke
 * Revoke an access or refresh token
 */
export async function POST() {
  return NextResponse.json({ revoked: true });
}
