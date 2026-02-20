import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { durationMinutes?: number; reason?: string };

  const durationMinutes = body.durationMinutes ?? 60;

  return NextResponse.json({
    alertId,
    muted: true,
    muteUntil: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
    reason: body.reason ?? null,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params;
  const requestId = getRequestId(request);

  return NextResponse.json({
    alertId,
    muted: false,
    requestId,
  }, {
    headers: { "x-request-id": requestId },
  });
}
