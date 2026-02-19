import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/stacks/{stackId}/unlock:
 *   post:
 *     summary: Unlock stack
 *     description: Release the exclusive lock on a stack
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
 *               force:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  const { stackId } = await params;
  return NextResponse.json({
    id: stackId,
    lockState: "UNLOCKED",
    lockedBy: null,
    lockedAt: null,
    lockReason: null,
    lockExpiresAt: null,
  });
}
