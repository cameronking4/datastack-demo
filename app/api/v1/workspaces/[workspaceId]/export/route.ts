import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/export:
 *   get:
 *     summary: Get workspace export
 *     description: Request or retrieve a workspace configuration export (stacks, jobs, connections metadata)
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, yaml]
 *     responses:
 *       200:
 *         description: Success
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
