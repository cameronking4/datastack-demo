import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/workspaces/{workspaceId}/export
 * Request or retrieve a workspace configuration export (stacks, jobs, connections metadata).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const format = searchParams.get("format") ?? "json";

  return ok(
    {
      workspaceId,
      format,
      status: "ready",
      exportedAt: new Date().toISOString(),
      resources: {
        stacks: 2,
        jobs: 12,
        pipelines: 5,
        connections: 8,
        queries: 24,
      },
      downloadUrl: `https://api.datastack.cloud/exports/${workspaceId}-${Date.now()}.${format}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
    { requestId }
  );
}
