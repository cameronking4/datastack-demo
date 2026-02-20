import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") ?? "last_30_days";
  const requestId = getRequestId(request);

  return NextResponse.json({
    workspaceId,
    period,
    generatedAt: new Date().toISOString(),
    summary: {
      totalComputeHours: 1240.5,
      totalStorageGb: 3200,
      totalPipelineRuns: 1840,
      totalJobRuns: 5620,
      activeUsers: 24,
      sqlQueriesExecuted: 15420,
    },
    byResource: {
      clusters: [{ id: "cluster-001", computeHours: 720 }, { id: "cluster-002", computeHours: 520.5 }],
      pipelines: [{ id: "pipe-001", runs: 1200 }, { id: "pipe-002", runs: 640 }],
    },
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
