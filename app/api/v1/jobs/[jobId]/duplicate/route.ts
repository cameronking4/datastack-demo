import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/duplicate:
 *   post:
 *     summary: Duplicate job
 *     parameters:
 *       - in: path
 *         name: jobId
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
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { name?: string } | undefined;

  return created(
    {
      jobId: 3000 + Math.floor(Math.random() * 1000),
      sourceJobId: jobId,
      name: body?.name ?? "Copy of Daily ETL",
      description: "Ingest and transform raw events",
      schedule: "0 0 2 * * ?",
      timezone: "UTC",
      triggerType: "PERIODIC",
      state: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
