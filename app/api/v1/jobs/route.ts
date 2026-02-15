import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/jobs
 * List jobs in workspace
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));

  return NextResponse.json({
    jobs: [
      {
        jobId: 1001,
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
      },
      {
        jobId: 1002,
        name: "Weekly Report",
        description: "Aggregate metrics and send report",
        schedule: "0 0 9 ? * MON",
        trigger: "PERIODIC",
        settings: {
          clusterId: "cluster-002",
          notebookPath: "/Workspace/Reports/weekly",
          timeoutSeconds: 7200,
        },
        createdAt: "2024-02-15T08:00:00Z",
        createdBy: "ada@datastack.dev",
      },
    ],
    totalCount: 2,
  });
}
