import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/me/recent
 * Get resources the current user recently viewed or edited.
 */
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);

  return ok(
    {
      queries: [
        { id: "q-001", name: "Daily Active Users", lastViewedAt: "2024-06-10T09:00:00Z" },
      ],
      pipelines: [
        { id: "pipe-001", name: "Bronze Ingestion", lastViewedAt: "2024-06-09T16:00:00Z" },
      ],
      clusters: [
        { id: "cluster-001", name: "Analytics Cluster", lastViewedAt: "2024-06-08T14:00:00Z" },
      ],
      stacks: [
        { id: "stack-001", name: "Analytics Platform", lastViewedAt: "2024-06-10T08:30:00Z" },
      ],
    },
    { requestId }
  );
}
