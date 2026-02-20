import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}/resize:
 *   post:
 *     summary: Resize cluster
 *     description: Resize cluster workers or node type
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numWorkers:
 *                 type: integer
 *               minWorkers:
 *                 type: integer
 *               maxWorkers:
 *                 type: integer
 *               nodeType:
 *                 type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    numWorkers?: number;
    minWorkers?: number;
    maxWorkers?: number;
    nodeType?: string;
  };

  return NextResponse.json(
    {
      clusterId,
      resizeRequestId: "resize-" + Date.now(),
      numWorkers: body.numWorkers ?? 4,
      minWorkers: body.minWorkers ?? 2,
      maxWorkers: body.maxWorkers ?? 8,
      nodeType: body.nodeType ?? "i3.xlarge",
      status: "RESIZE_ACCEPTED",
      message: "Cluster resize has been queued. Changes will apply after the next restart or when autoscale runs.",
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}
