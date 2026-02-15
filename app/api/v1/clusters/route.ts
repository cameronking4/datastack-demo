import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/clusters
 * List clusters in workspace with optional state filter
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    clusters: [
      {
        id: "cluster-001",
        name: "Analytics Cluster",
        clusterSize: "Medium",
        region: "us-east-1",
        state: "RUNNING",
        sparkVersion: "3.5.x-scala2.12",
        nodeType: "i3.xlarge",
        numWorkers: 4,
        autoTerminationMinutes: 30,
        createdAt: "2024-03-01T09:00:00Z",
      },
      {
        id: "cluster-002",
        name: "ETL Jobs",
        clusterSize: "Large",
        region: "us-west-2",
        state: "RUNNING",
        sparkVersion: "3.5.x-scala2.12",
        nodeType: "r5.2xlarge",
        numWorkers: 8,
        autoTerminationMinutes: 0,
        createdAt: "2024-03-15T14:00:00Z",
      },
    ],
    totalCount: 2,
  });
}

/**
 * POST /api/v1/clusters
 * Create a new compute cluster
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    workspaceId: string;
    sparkVersion: string;
    nodeType: string;
    workerCount?: number;
    enableAutoscaling?: boolean;
    minWorkers?: number;
    maxWorkers?: number;
    autoTerminationMinutes?: number;
    tags?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "cluster-new",
      name: body.name,
      workspaceId: body.workspaceId,
      clusterSize: "Medium",
      region: "us-east-1",
      state: "PENDING",
      sparkVersion: body.sparkVersion,
      nodeType: body.nodeType,
      workerCount: body.workerCount ?? 2,
      enableAutoscaling: body.enableAutoscaling ?? false,
      minWorkers: body.minWorkers ?? 1,
      maxWorkers: body.maxWorkers ?? 8,
      autoTerminationMinutes: body.autoTerminationMinutes ?? 30,
      tags: body.tags ?? {},
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
