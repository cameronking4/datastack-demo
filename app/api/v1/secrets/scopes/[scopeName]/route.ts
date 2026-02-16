import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/secrets/scopes/{scopeName}:
 *   get:
 *     summary: List secrets in scope
 *     description: List secret keys in a scope (values are redacted)
 *     parameters:
 *       - in: path
 *         name: scopeName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete secret scope
 *     parameters:
 *       - in: path
 *         name: scopeName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/secrets/scopes/:scopeName
 * List secret keys in a scope (values are redacted)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scopeName: string }> }
) {
  const { scopeName } = await params;
  return NextResponse.json({
    scope: scopeName,
    secrets: [
      {
        key: "access_key_id",
        lastUpdatedAt: "2024-03-01T10:00:00Z",
        lastUpdatedBy: "ada@datastack.dev",
      },
      {
        key: "secret_access_key",
        lastUpdatedAt: "2024-03-01T10:00:00Z",
        lastUpdatedBy: "ada@datastack.dev",
      },
      {
        key: "session_token",
        lastUpdatedAt: "2024-06-01T08:00:00Z",
        lastUpdatedBy: "ada@datastack.dev",
      },
    ],
    totalCount: 3,
  });
}

/**
 * DELETE /api/v1/secrets/scopes/:scopeName
 * Delete an entire secret scope
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ scopeName: string }> }
) {
  const { scopeName } = await params;
  return NextResponse.json({
    message: `Secret scope '${scopeName}' deleted.`,
  });
}
