import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/webhooks
 * List registered webhooks
 */
export async function GET() {
  return NextResponse.json({
    webhooks: [
      {
        id: "wh-001",
        url: "https://example.com/hooks/datastack",
        events: ["job.completed", "job.failed", "cluster.terminated"],
        active: true,
        createdAt: "2024-03-01T09:00:00Z",
        updatedAt: "2024-05-15T10:00:00Z",
        lastTriggeredAt: "2024-06-10T02:15:33Z",
        failureCount: 0,
      },
    ],
    totalCount: 1,
  });
}

/**
 * POST /api/v1/webhooks
 * Create webhook
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    url: string;
    events: string[];
    secret?: string;
    active?: boolean;
  };
  return NextResponse.json(
    {
      id: "wh-new",
      url: body.url,
      events: body.events,
      secret: body.secret ?? undefined,
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failureCount: 0,
    },
    { status: 201 }
  );
}
