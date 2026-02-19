import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/alerts
 * List monitoring alerts
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    alerts: [
      {
        id: "alert-001",
        name: "Job Failure Alert",
        condition: "job.status == FAILED",
        severity: "CRITICAL",
        target: { type: "job", id: "1001" },
        channels: ["email", "slack"],
        active: true,
        createdAt: "2024-03-10T08:00:00Z",
        createdBy: "ada@datastack.dev",
        lastTriggeredAt: "2024-06-09T14:22:00Z",
        triggerCount: 3,
      },
      {
        id: "alert-002",
        name: "Cluster High CPU",
        condition: "cluster.cpu_utilization > 90",
        severity: "WARNING",
        target: { type: "cluster", id: "cluster-001" },
        channels: ["email"],
        active: true,
        createdAt: "2024-04-01T12:00:00Z",
        createdBy: "bob@datastack.dev",
        lastTriggeredAt: "2024-06-08T03:45:00Z",
        triggerCount: 12,
      },
      {
        id: "alert-003",
        name: "Pipeline SLA Breach",
        condition: "pipeline.duration > 3600",
        severity: "CRITICAL",
        target: { type: "pipeline", id: "pipe-001" },
        channels: ["slack", "pagerduty"],
        active: false,
        createdAt: "2024-05-20T16:00:00Z",
        createdBy: "ada@datastack.dev",
        lastTriggeredAt: null,
        triggerCount: 0,
      },
    ],
    totalCount: 3,
  });
}

/**
 * POST /api/v1/alerts
 * Create a new alert
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    condition: string;
    severity: string;
    target: { type: string; id: string };
    channels: string[];
    active?: boolean;
  };
  return NextResponse.json(
    {
      id: "alert-new",
      name: body.name,
      condition: body.condition,
      severity: body.severity,
      target: body.target,
      channels: body.channels,
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
      createdBy: "api",
      lastTriggeredAt: null,
      triggerCount: 0,
    },
    { status: 201 }
  );
}
