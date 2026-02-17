import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const body = (await request.json()) as {
    userId?: string;
    context?: string;
  };

  return NextResponse.json({
    userId: body.userId ?? "user-001",
    context: body.context ?? "exploration",
    recommendations: [
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.customer_360",
        name: "customer_360",
        reason: "Frequently used by your team",
        relevanceScore: 0.92,
      },
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.product_catalog",
        name: "product_catalog",
        reason: "Related to your recent queries",
        relevanceScore: 0.88,
      },
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.revenue_metrics",
        name: "revenue_metrics",
        reason: "Popular in your department",
        relevanceScore: 0.85,
      },
    ],
    generatedAt: new Date().toISOString(),
  });
}
