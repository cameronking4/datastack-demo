import { NextRequest } from "next/server";
import { ok, noContent, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/dashboards/{dashboardId}:
 *   get:
 *     summary: Get dashboard
 *     description: Get dashboard with widget configuration
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update dashboard
 *     description: Update dashboard name or widget layout
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete dashboard
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  const { dashboardId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      id: dashboardId,
      name: "Platform Overview",
      workspaceId: "ws-001",
      widgets: [
        { id: "w1", type: "job_runs", config: {}, position: { x: 0, y: 0, w: 6, h: 3 } },
        { id: "w2", type: "cluster_utilization", config: {}, position: { x: 6, y: 0, w: 6, h: 3 } },
        { id: "w3", type: "query_volume", config: {}, position: { x: 0, y: 3, w: 12, h: 2 } },
      ],
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-06-01T12:00:00Z",
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  const { dashboardId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as Record<string, unknown>;

  return ok(
    {
      id: dashboardId,
      ...body,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  await params;
  return noContent({ requestId: getRequestId(_request) });
}
