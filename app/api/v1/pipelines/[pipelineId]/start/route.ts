import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/pipelines/:pipelineId/start
 * Start pipeline (trigger update)
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  return NextResponse.json({
    id: pipelineId,
    name: "Bronze Ingestion",
    workspaceId: "ws-001",
    state: "RUNNING",
    target: "PRODUCTION",
    catalog: "main",
    schema: "bronze",
    continuous: true,
    photon: true,
    edition: "PRO",
    clusters: [],
    createdAt: "2024-03-01T09:00:00Z",
    createdBy: "ada@datastack.dev",
    lastRunAt: new Date().toISOString(),
  });
}
