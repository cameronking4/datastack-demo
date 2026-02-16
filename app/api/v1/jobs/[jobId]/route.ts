import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/jobs/{jobId}:
 *   get:
 *     summary: Get job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/jobs/:jobId
 * Get job by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const jobIdNum = parseInt(jobId, 10);
  return NextResponse.json({
    jobId: jobIdNum,
    name: "Daily ETL",
    description: "Ingest and transform raw events",
    schedule: "0 0 2 * * ?",
    trigger: "PERIODIC",
    settings: {
      clusterId: "cluster-001",
      notebookPath: "/Workspace/ETL/daily_pipeline",
      timeoutSeconds: 3600,
    },
    createdAt: "2024-02-01T10:00:00Z",
    createdBy: "ada@datastack.dev",
  });
}
