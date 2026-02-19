import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    source?: { type: string; topic: string };
    sink?: { type: string; table: string };
    format?: string;
  };

  return NextResponse.json(
    {
      streamId: "stream-" + Date.now(),
      name: body.name ?? "Untitled Stream",
      source: body.source ?? { type: "KAFKA", topic: "events" },
      sink: body.sink ?? { type: "DELTA", table: "catalog.schema.events_stream" },
      format: body.format ?? "JSON",
      status: "CREATED",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
