import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/usage
 * Get workspace usage stats (compute, storage, API calls).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const workspaceId = searchParams.get("workspaceId");
  const period = searchParams.get("period") ?? "current_month";

  return ok(
    {
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
      clusters: {
        active: 3,
        maxConcurrent: 10,
        totalRuntimeHours: 156,
      },
      queries: {
        executed: 12450,
        avgLatencyMs: 234,
      },
    },
    { requestId }
  );
}
