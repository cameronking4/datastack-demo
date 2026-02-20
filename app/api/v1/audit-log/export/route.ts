import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/audit-log/export:
 *   post:
 *     summary: Export audit log
 *     description: Request an audit log export (async job; download URL provided when ready)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               since:
 *                 type: string
 *                 format: date-time
 *               until:
 *                 type: string
 *                 format: date-time
 *               format:
 *                 type: string
 *                 enum: [json, csv]
 *               resourceTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    since?: string;
    until?: string;
    format?: "json" | "csv";
    resourceTypes?: string[];
  };

  return created(
    {
      exportId: "export-" + Date.now(),
      status: "pending",
      format: body.format ?? "json",
      since: body.since ?? null,
      until: body.until ?? null,
      resourceTypes: body.resourceTypes ?? [],
      estimatedReadyAt: new Date(Date.now() + 300000).toISOString(),
      downloadUrl: null,
    },
    { requestId }
  );
}
