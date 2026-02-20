import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/backup:
 *   post:
 *     summary: Create workspace backup
 *     description: Queue a workspace backup (metadata or full)
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: string
 *                 enum: [metadata, full]
 *               includeSecrets:
 *                 type: boolean
 *               destinationPath:
 *                 type: string
 *     responses:
 *       202:
 *         description: Accepted
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    scope?: "metadata" | "full";
    includeSecrets?: boolean;
    destinationPath?: string;
  };

  return NextResponse.json(
    {
      workspaceId,
      backupId: "backup-" + Date.now(),
      scope: body.scope ?? "metadata",
      includeSecrets: body.includeSecrets ?? false,
      destinationPath: body.destinationPath ?? null,
      status: "BACKUP_QUEUED",
      message: "Backup has been queued. You will be notified when it completes.",
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const requestId = getRequestId(request);

  const backups = [
    { backupId: "backup-1", scope: "metadata", status: "COMPLETED", createdAt: "2024-08-15T03:00:00Z", sizeBytes: 52428800 },
    { backupId: "backup-2", scope: "full", status: "COMPLETED", createdAt: "2024-08-08T03:00:00Z", sizeBytes: 1073741824 },
  ];

  return NextResponse.json({
    workspaceId,
    backups,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
