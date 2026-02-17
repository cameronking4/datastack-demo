import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_QUERY_INTELLIGENCE_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_QUERY_INTELLIGENCE_HEADER)) {
    return featureRequiredResponse(FEATURE_QUERY_INTELLIGENCE_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const threshold = searchParams.get("thresholdMs") ?? "5000";

  return NextResponse.json({
    thresholdMs: parseInt(threshold, 10),
    queries: [
      {
        queryId: "q-001",
        sql: "SELECT * FROM events WHERE ...",
        durationMs: 45200,
        user: "analyst@datastack.dev",
        warehouse: "wh-001",
        bytesScanned: 10737418240,
        executedAt: "2025-11-30T14:20:00Z",
      },
      {
        queryId: "q-002",
        sql: "SELECT COUNT(*) FROM large_table GROUP BY ...",
        durationMs: 22100,
        user: "etl@datastack.dev",
        warehouse: "wh-002",
        bytesScanned: 5368709120,
        executedAt: "2025-11-30T15:10:00Z",
      },
    ],
    totalCount: 2,
    period: "last_24h",
  });
}
