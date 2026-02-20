import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/catalog/recommendations:
 *   post:
 *     summary: Get catalog recommendations
 *     description: Get personalized catalog recommendations for a user or context
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
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
