import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_OBSERVABILITY_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_OBSERVABILITY_HEADER)) {
    return featureRequiredResponse(FEATURE_OBSERVABILITY_HEADER);
  }
  const { runId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level");
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10)));
  const requestId = getRequestId(request);

  const logs = [
    { timestamp: "2024-06-10T02:00:00.100Z", level: "INFO", message: "Job started", source: "driver" },
    { timestamp: "2024-06-10T02:00:05.200Z", level: "INFO", message: "Initializing Spark context", source: "driver" },
    { timestamp: "2024-06-10T02:00:30.500Z", level: "INFO", message: "Reading from source path", source: "executor-1" },
    { timestamp: "2024-06-10T02:15:00.000Z", level: "WARN", message: "Large partition detected, consider repartitioning", source: "executor-2" },
    { timestamp: "2024-06-10T02:44:55.000Z", level: "INFO", message: "Job completed successfully", source: "driver" },
  ];

  let filtered = logs;
  if (level) filtered = filtered.filter((l) => l.level === level);
  const sliced = filtered.slice(0, limit);

  return NextResponse.json({
    runId,
    logs: sliced,
    totalCount: filtered.length,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
