import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/health
 * Liveness/readiness check for load balancers and orchestrators.
 * Returns 200 when the API is accepting requests.
 */
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  return NextResponse.json(
    {
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      requestId,
    },
    {
      headers: {
        "x-request-id": requestId,
      },
    }
  );
}
