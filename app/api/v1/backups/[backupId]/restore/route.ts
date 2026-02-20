import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/backups/{backupId}/restore:
 *   post:
 *     summary: Restore from backup
 *     description: Restore a workspace from a backup
 *     parameters:
 *       - in: path
 *         name: backupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetWorkspaceId:
 *                 type: string
 *               overwrite:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * POST /api/v1/backups/:backupId/restore
 * Restore a workspace from a backup.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ backupId: string }> }
) {
  const requestId = getRequestId(request);
  const { backupId } = await params;
  const body = (await request.json()) as {
    targetWorkspaceId?: string;
    overwrite?: boolean;
  };

  return created(
    {
      restoreId: "restore-" + Date.now(),
      backupId,
      targetWorkspaceId: body.targetWorkspaceId ?? "ws-001",
      overwrite: body.overwrite ?? false,
      status: "queued",
      startedAt: new Date().toISOString(),
      estimatedCompletionMinutes: 45,
    },
    { requestId }
  );
}
