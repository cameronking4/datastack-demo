import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}:
 *   get:
 *     summary: Get workspace
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
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
