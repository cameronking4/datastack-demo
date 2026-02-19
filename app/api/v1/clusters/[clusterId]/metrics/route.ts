import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * GET /api/v1/clusters/:clusterId/metrics
 * Get cluster performance metrics (preview only)
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
