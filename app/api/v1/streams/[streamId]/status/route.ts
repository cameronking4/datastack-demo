import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const { streamId } = await params;

  return NextResponse.json({
    streamId,
    status: "RUNNING",
    health: "HEALTHY",
    uptime: "72h 15m",
    lastProcessedAt: "2025-12-01T10:00:00Z",
    errors: {
      last24h: 0,
      total: 3,
    },
    lag: {
      currentOffsetLag: 120,
      maxLagMs: 450,
    },
  });
}
