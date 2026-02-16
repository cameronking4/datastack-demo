import { NextRequest, NextResponse } from "next/server";

export const PREVIEW_HEADER = "x-datastack-preview";

export function isPreviewEnabled(request: NextRequest): boolean {
  return request.headers.get(PREVIEW_HEADER) === "true";
}

export function previewRequiredResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "PreviewRequired",
      message:
        "This endpoint requires the preview feature flag. Set the X-DataStack-Preview: true header to access preview functionality.",
    },
    { status: 400 }
  );
}

export function previewParamIgnoredFields(
  body: Record<string, unknown>,
  previewFields: string[]
): string[] {
  return previewFields.filter((field) => field in body);
}

export function stripNonPreviewFields<T extends Record<string, unknown>>(
  body: T,
  previewFields: string[]
): T {
  const cleaned = { ...body };
  for (const field of previewFields) {
    delete cleaned[field];
  }
  return cleaned;
}
