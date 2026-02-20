import { NextRequest } from "next/server";
import { getRequestId, ok, noContent } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/retention/policies/{policyId}:
 *   get:
 *     summary: Get retention policy
 *     description: Get a retention policy by ID
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update retention policy
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               retentionDays:
 *                 type: integer
 *               action:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete retention policy
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  const { policyId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      policyId,
      name: "Raw Events 90d",
      description: "Retain raw event tables for 90 days then archive",
      workspaceId: "ws-001",
      targetType: "TABLE",
      targetPattern: "main.raw_events.*",
      retentionDays: 90,
      action: "ARCHIVE",
      enabled: true,
      lastRunAt: "2024-08-18T03:00:00Z",
      nextRunAt: "2024-08-19T03:00:00Z",
      createdAt: "2024-03-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  const { policyId } = await params;
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    retentionDays?: number;
    action?: string;
    enabled?: boolean;
  };
  const requestId = getRequestId(request);

  return ok(
    {
      policyId,
      name: body.name ?? "Raw Events 90d",
      description: body.description ?? "Retain raw event tables for 90 days then archive",
      retentionDays: body.retentionDays ?? 90,
      action: body.action ?? "ARCHIVE",
      enabled: body.enabled ?? true,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  await params;
  return noContent();
}
