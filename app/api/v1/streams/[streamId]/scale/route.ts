import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const { streamId } = await params;
  const body = (await request.json()) as {
    targetParallelism?: number;
    autoScale?: boolean;
    minParallelism?: number;
    maxParallelism?: number;
  };

  return NextResponse.json({
    streamId,
    currentParallelism: 4,
    targetParallelism: body.targetParallelism ?? 8,
    autoScale: body.autoScale ?? false,
    minParallelism: body.minParallelism ?? 2,
    maxParallelism: body.maxParallelism ?? 16,
    scaleStatus: "SCALING_UP",
    estimatedCompletionSeconds: 30,
    updatedAt: new Date().toISOString(),
  });
}
