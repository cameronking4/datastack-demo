import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_MLOPS_HEADER)) {
    return featureRequiredResponse(FEATURE_MLOPS_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const featureGroup = searchParams.get("featureGroup");

  return NextResponse.json({
    features: [
      {
        featureId: "feat-001",
        name: "user_age_bucket",
        group: featureGroup ?? "user_features",
        dataType: "INTEGER",
        description: "User age bucketed into ranges",
        source: "catalog.schema.users",
        freshness: "1h",
        createdAt: "2025-10-01T00:00:00Z",
      },
      {
        featureId: "feat-002",
        name: "purchase_count_30d",
        group: featureGroup ?? "user_features",
        dataType: "INTEGER",
        description: "Number of purchases in the last 30 days",
        source: "catalog.schema.orders",
        freshness: "6h",
        createdAt: "2025-10-15T00:00:00Z",
      },
      {
        featureId: "feat-003",
        name: "avg_session_duration",
        group: featureGroup ?? "engagement_features",
        dataType: "DOUBLE",
        description: "Average session duration in seconds",
        source: "catalog.schema.sessions",
        freshness: "24h",
        createdAt: "2025-11-01T00:00:00Z",
      },
    ],
    totalCount: 3,
  });
}
