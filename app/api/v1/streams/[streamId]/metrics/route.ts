import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/streams/{streamId}/metrics:
 *   get:
 *     summary: Get stream metrics
 *     description: Get streaming job throughput and latency metrics
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const { streamId } = await params;

  return NextResponse.json({
    streamId,
    period: "last_1h",
    throughput: {
      recordsPerSecond: 12500,
      bytesPerSecond: 5242880,
      peakRecordsPerSecond: 18000,
    },
    latency: {
      avgMs: 45,
      p50Ms: 30,
      p95Ms: 120,
      p99Ms: 350,
    },
    backpressure: {
      active: false,
      occurrencesLast1h: 0,
    },
    recordsProcessed: 45000000,
  });
}
