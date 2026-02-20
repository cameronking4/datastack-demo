import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_QUERY_INTELLIGENCE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/queries/cache-strategy:
 *   post:
 *     summary: Create cache strategy
 *     description: Create or update query result cache strategy for a warehouse
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouseId:
 *                 type: string
 *               ttlMinutes:
 *                 type: integer
 *               maxCacheSizeMb:
 *                 type: integer
 *               enableAdaptive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_QUERY_INTELLIGENCE_HEADER)) {
    return featureRequiredResponse(FEATURE_QUERY_INTELLIGENCE_HEADER);
  }

  const body = (await request.json()) as {
    warehouseId?: string;
    ttlMinutes?: number;
    maxCacheSizeMb?: number;
    enableAdaptive?: boolean;
  };

  return NextResponse.json(
    {
      strategyId: "cache-" + Date.now(),
      warehouseId: body.warehouseId ?? "wh-001",
      ttlMinutes: body.ttlMinutes ?? 60,
      maxCacheSizeMb: body.maxCacheSizeMb ?? 10240,
      enableAdaptive: body.enableAdaptive ?? true,
      status: "ACTIVE",
      currentCacheHitRate: 0,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
