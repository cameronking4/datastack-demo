import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/alerts/:alertId
 * Get alert by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  return NextResponse.json({
    id: alertId,
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
  });
}

/**
 * PATCH /api/v1/alerts/:alertId
 * Update an existing alert
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const body = (await request.json()) as {
    name?: string;
    condition?: string;
    severity?: string;
    channels?: string[];
    active?: boolean;
  };
  return NextResponse.json({
    id: alertId,
    name: body.name ?? "Job Failure Alert",
    condition: body.condition ?? "job.status == FAILED",
    severity: body.severity ?? "CRITICAL",
    target: { type: "job", id: "1001" },
    channels: body.channels ?? ["email", "slack"],
    active: body.active ?? true,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * DELETE /api/v1/alerts/:alertId
 * Delete an alert
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  return NextResponse.json({
    message: `Alert ${alertId} deleted.`,
  });
}
