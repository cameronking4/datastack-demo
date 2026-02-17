import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_QUERY_INTELLIGENCE_HEADER } from "@/lib/api/preview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_QUERY_INTELLIGENCE_HEADER)) {
    return featureRequiredResponse(FEATURE_QUERY_INTELLIGENCE_HEADER);
  }

  const { queryId } = await params;

  return NextResponse.json({
    queryId,
    executionPlan: {
      type: "PHYSICAL",
      nodes: [
        { id: 1, operation: "Scan", table: "events", estimatedRows: 1000000, cost: 450.0 },
        { id: 2, operation: "Filter", predicate: "date >= '2025-01-01'", estimatedRows: 500000, cost: 120.0 },
        { id: 3, operation: "HashAggregate", keys: ["user_id"], estimatedRows: 50000, cost: 200.0 },
        { id: 4, operation: "Sort", keys: ["count DESC"], estimatedRows: 50000, cost: 80.0 },
      ],
    },
    estimatedDurationMs: 3200,
    estimatedBytesScanned: 2147483648,
    suggestions: [
      "Add partition pruning on date column to reduce scan",
      "Consider materialized view for frequently accessed aggregation",
    ],
  });
}
