import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const { resourceType, resourceId } = await params;
  const body = (await request.json()) as {
    tags?: string[];
  };

  return NextResponse.json({
    resourceType,
    resourceId,
    tags: body.tags ?? ["production", "verified"],
    updatedAt: new Date().toISOString(),
    updatedBy: "api",
  });
}
