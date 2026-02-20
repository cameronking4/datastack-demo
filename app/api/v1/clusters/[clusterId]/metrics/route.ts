import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}/metrics:
 *   get:
 *     summary: Get cluster metrics
 *     description: Get cluster performance metrics (preview only)
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: metricNames
 *         schema:
 *           type: string
 *         description: Comma-separated metric names
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  if (!isPreviewEnabled(request)) {
    return previewRequiredResponse();
  }

  const { clusterId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const startTime = searchParams.get("startTime") ?? "2024-06-10T00:00:00Z";
  const endTime = searchParams.get("endTime") ?? "2024-06-10T01:00:00Z";
  const metricNames = searchParams.get("metricNames")?.split(",") ?? [
    "cpuUtilization",
    "memoryUtilization",
  ];

  return NextResponse.json({
    clusterId,
    startTime,
    endTime,
    metrics: metricNames.map((name) => ({
      name,
      dataPoints: [
        { timestamp: startTime, value: 42.5 },
        { timestamp: endTime, value: 67.8 },
      ],
      unit: name.includes("Utilization") ? "percent" : "count",
    })),
  });
}
