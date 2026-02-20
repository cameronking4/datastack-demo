import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/usage:
 *   get:
 *     summary: Get usage
 *     description: Get workspace usage stats (compute, storage, API calls, streaming, AI units)
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *       - in: query
 *         name: includeForecast
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const period = searchParams.get("period") ?? "current_month";
  const includeForecast = searchParams.get("includeForecast") === "true";

  const payload: Record<string, unknown> = {
    workspaceId: workspaceId ?? "ws-001",
    period,
    dbus: {
      used: 245000,
      limit: 500000,
      unit: "DBU",
    },
    storage: {
      usedGb: 1234,
      limitGb: 5000,
    },
    apiCalls: {
      used: 45230,
      limit: 100000,
    },
    streamingUnits: {
      used: 1200,
      limit: 5000,
      unit: "SU",
    },
    aiUnits: {
      used: 450,
      limit: 2000,
      unit: "AIU",
    },
    clusters: {
      active: 3,
      maxConcurrent: 10,
      totalRuntimeHours: 156,
    },
    queries: {
      executed: 12450,
      avgLatencyMs: 234,
    },
  };

  if (includeForecast) {
    (payload as Record<string, unknown>).forecast = {
      dbusProjected: 280000,
      storageProjectedGb: 1450,
      projectedAt: "2024-07-01",
    };
  }

  return ok(payload, { requestId });
}
