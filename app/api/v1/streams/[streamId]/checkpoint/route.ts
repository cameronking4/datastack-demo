import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/streams/{streamId}/checkpoint:
 *   post:
 *     summary: Create checkpoint
 *     description: Create or manage stream checkpoint
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const { streamId } = await params;
  const body = (await request.json()) as {
    action?: string;
  };

  return NextResponse.json(
    {
      checkpointId: "chk-" + Date.now(),
      streamId,
      action: body.action ?? "CREATE",
      offset: { partition0: 125000, partition1: 98000, partition2: 112000 },
      timestamp: new Date().toISOString(),
      sizeBytes: 2048576,
      status: "COMPLETED",
    },
    { status: 201 }
  );
}
