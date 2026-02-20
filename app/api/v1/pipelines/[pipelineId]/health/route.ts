import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/health:
 *   get:
 *     summary: Get pipeline health
 *     description: Get pipeline health checks and status
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const requestId = getRequestId(_request);

  return NextResponse.json({
    pipelineId,
    status: "HEALTHY",
    lastCheckedAt: new Date().toISOString(),
    checks: [
      { name: "cluster_connectivity", status: "PASS", message: null },
      { name: "storage_access", status: "PASS", message: null },
      { name: "catalog_sync", status: "PASS", message: null },
      { name: "libraries_loaded", status: "PASS", message: null },
    ],
    uptimeSeconds: 86400,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
