import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") ?? "last_30d";

  return NextResponse.json({
    period,
    datasets: [
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.orders",
        name: "orders",
        queryCount: 12500,
        uniqueUsers: 45,
        avgDailyQueries: 416,
        trend: "STABLE",
      },
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.events",
        name: "events",
        queryCount: 8900,
        uniqueUsers: 32,
        avgDailyQueries: 296,
        trend: "INCREASING",
      },
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.users",
        name: "users",
        queryCount: 6200,
        uniqueUsers: 28,
        avgDailyQueries: 206,
        trend: "STABLE",
      },
    ],
  });
}
