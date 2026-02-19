import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_LINEAGE_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_LINEAGE_HEADER)) {
    return featureRequiredResponse(FEATURE_LINEAGE_HEADER);
  }

  const body = (await request.json()) as {
    catalog?: string;
    schema?: string;
    depth?: number;
  };

  return NextResponse.json(
    {
      scanId: "scan-" + Date.now(),
      status: "QUEUED",
      catalog: body.catalog ?? "main",
      schema: body.schema ?? "default",
      depth: body.depth ?? 3,
      estimatedDurationSeconds: 120,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
