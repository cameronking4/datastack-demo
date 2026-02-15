import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/workspaces/:workspaceId
 * Get workspace by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  return NextResponse.json({
    id: workspaceId,
    name: "Acme Corp Production",
    region: "us-west-2",
    deploymentUrl: "https://acme.datastack.cloud",
    status: "ACTIVE",
    createdAt: "2024-01-10T08:00:00Z",
  });
}
