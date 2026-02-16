import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/api-keys/{keyId}:
 *   delete:
 *     summary: Revoke API key
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * DELETE /api/v1/auth/api-keys/:keyId
 * Revoke an API key (cannot be undone)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  const { keyId } = await params;
  return NextResponse.json({
    id: keyId,
    name: "CI/CD Pipeline Key",
    prefix: "dsk_live_abc",
    scopes: ["read:clusters", "manage:jobs"],
    expiresAt: "2025-06-01T00:00:00Z",
    createdAt: "2024-06-01T10:00:00Z",
    lastUsedAt: "2024-06-10T08:00:00Z",
    status: "REVOKED",
  });
}
