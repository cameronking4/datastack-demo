import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/alerts/{alertId}/mute:
 *   post:
 *     summary: Mute alert
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               durationMinutes:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Unmute alert
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { durationMinutes?: number; reason?: string };

  const durationMinutes = body.durationMinutes ?? 60;

  return NextResponse.json({
    alertId,
    muted: true,
    muteUntil: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
    reason: body.reason ?? null,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);

  return NextResponse.json({
    alertId,
    muted: false,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
