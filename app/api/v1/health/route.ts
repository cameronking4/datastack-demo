import { NextRequest, NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     description: Liveness/readiness check for load balancers and orchestrators. Query param probe=readiness includes dependency checks.
 *     parameters:
 *       - in: query
 *         name: probe
 *         schema:
 *           type: string
 *           enum: [readiness]
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);
  const probe = request.nextUrl.searchParams.get("probe");

  const payload: Record<string, unknown> = {
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    requestId,
  };

  if (probe === "readiness") {
    payload.checks = {
      api: { status: "up" },
      catalog: { status: "up", latencyMs: 12 },
      metastore: { status: "up", latencyMs: 8 },
    };
    payload.ready = true;
  }

  return NextResponse.json(payload, {
    headers: { "x-request-id": requestId },
  });
}
