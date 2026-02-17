import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_QUERY_INTELLIGENCE_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_QUERY_INTELLIGENCE_HEADER)) {
    return featureRequiredResponse(FEATURE_QUERY_INTELLIGENCE_HEADER);
  }

  const body = (await request.json()) as {
    sql?: string;
  };

  return NextResponse.json({
    originalSql: body.sql ?? "SELECT * FROM events",
    optimizedSql: "SELECT id, user_id, event_type, created_at FROM events WHERE created_at >= CURRENT_DATE - INTERVAL 30 DAY",
    improvements: [
      { type: "COLUMN_PRUNING", description: "Select only needed columns instead of *", estimatedSpeedup: "40%" },
      { type: "PREDICATE_PUSHDOWN", description: "Add date filter to reduce scan range", estimatedSpeedup: "60%" },
    ],
    estimatedCostReduction: 72.5,
    originalEstimatedMs: 15000,
    optimizedEstimatedMs: 2100,
  });
}
