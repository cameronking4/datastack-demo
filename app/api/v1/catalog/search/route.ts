import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/catalog/search:
 *   post:
 *     summary: Search catalog
 *     description: Search catalog assets by query and filters
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               filters:
 *                 type: object
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const body = (await request.json()) as {
    query?: string;
    filters?: Record<string, string>;
    limit?: number;
  };

  return NextResponse.json({
    query: body.query ?? "",
    results: [
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.orders",
        name: "orders",
        description: "Customer order transactions",
        relevanceScore: 0.95,
        tags: ["production", "pii"],
        owner: "data-team@datastack.dev",
        lastUpdated: "2025-11-30T23:00:00Z",
      },
      {
        resourceType: "TABLE",
        resourceId: "catalog.schema.order_items",
        name: "order_items",
        description: "Line items for each order",
        relevanceScore: 0.87,
        tags: ["production"],
        owner: "data-team@datastack.dev",
        lastUpdated: "2025-11-30T23:00:00Z",
      },
    ],
    totalCount: 2,
    limit: body.limit ?? 25,
  });
}
