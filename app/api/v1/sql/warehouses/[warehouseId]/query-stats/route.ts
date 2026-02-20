import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_QUERY_INTELLIGENCE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/sql/warehouses/{warehouseId}/query-stats:
 *   get:
 *     summary: Get warehouse query stats
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ warehouseId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_QUERY_INTELLIGENCE_HEADER)) {
    return featureRequiredResponse(FEATURE_QUERY_INTELLIGENCE_HEADER);
  }

  const { warehouseId } = await params;

  return NextResponse.json({
    warehouseId,
    period: "last_24h",
    stats: {
      totalQueries: 1250,
      avgDurationMs: 3400,
      p50DurationMs: 1200,
      p95DurationMs: 12000,
      p99DurationMs: 45000,
      totalBytesScanned: 107374182400,
      failedQueries: 12,
      queuedQueries: 3,
    },
    topUsers: [
      { user: "analyst@datastack.dev", queryCount: 320, avgDurationMs: 4500 },
      { user: "etl@datastack.dev", queryCount: 180, avgDurationMs: 8200 },
    ],
    peakHour: "14:00",
  });
}
