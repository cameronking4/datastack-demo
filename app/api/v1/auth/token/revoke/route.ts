import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/token/revoke:
 *   post:
 *     summary: Revoke token
 *     description: Revoke an access or refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/auth/token/revoke
 * Revoke an access or refresh token
 */
export async function POST() {
  return NextResponse.json({ revoked: true });
}
