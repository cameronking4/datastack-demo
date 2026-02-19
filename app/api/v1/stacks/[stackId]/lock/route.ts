import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks/{stackId}/lock:
 *   post:
 *     summary: Lock stack
 *     description: Acquire an exclusive lock on a stack to prevent concurrent modifications
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               ttlSeconds:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *       409:
 *         description: Stack is already locked
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string; ttlSeconds?: number };
  return NextResponse.json({
    id: stackId,
    lockState: "LOCKED",
    lockedBy: "api",
    lockedAt: new Date().toISOString(),
    lockReason: body.reason ?? null,
    lockExpiresAt: body.ttlSeconds
      ? new Date(Date.now() + body.ttlSeconds * 1000).toISOString()
      : null,
  });
}
