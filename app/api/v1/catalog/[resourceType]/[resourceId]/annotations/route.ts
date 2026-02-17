import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_CATALOG_HEADER } from "@/lib/api/preview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_CATALOG_HEADER)) {
    return featureRequiredResponse(FEATURE_CATALOG_HEADER);
  }

  const { resourceType, resourceId } = await params;
  const body = (await request.json()) as {
    content?: string;
    type?: string;
  };

  return NextResponse.json(
    {
      annotationId: "ann-" + Date.now(),
      resourceType,
      resourceId,
      content: body.content ?? "",
      type: body.type ?? "DOCUMENTATION",
      author: "api",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
