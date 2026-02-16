import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/workspaces:
 *   get:
 *     summary: List workspaces
 *     description: List workspaces the caller has access to
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/workspaces
 * List workspaces the caller has access to
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    workspaces: [
      {
        id: "ws-001",
        name: "Acme Corp Production",
        region: "us-west-2",
        deploymentUrl: "https://acme.datastack.cloud",
        status: "ACTIVE",
        createdAt: "2024-01-10T08:00:00Z",
      },
      {
        id: "ws-002",
        name: "Acme Corp Staging",
        region: "us-east-1",
        deploymentUrl: "https://acme-staging.datastack.cloud",
        status: "ACTIVE",
        createdAt: "2024-02-01T12:00:00Z",
      },
    ],
    totalCount: 2,
    nextPageToken: undefined,
  });
}
