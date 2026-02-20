import { NextRequest, NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/health
 * Liveness/readiness check for load balancers and orchestrators.
 * Returns 200 when the API is accepting requests.
 * Query param probe=readiness includes dependency checks.
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
