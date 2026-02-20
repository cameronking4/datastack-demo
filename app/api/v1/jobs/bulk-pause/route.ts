import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/jobs/bulk-pause:
 *   post:
 *     summary: Bulk pause jobs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { jobIds: string[] };
  const jobIds = body.jobIds ?? [];

  return ok(
    {
      paused: jobIds,
      failed: [] as string[],
      message: `Paused ${jobIds.length} job(s)`,
    },
    { requestId }
  );
}
