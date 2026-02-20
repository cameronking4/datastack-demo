import { NextRequest, NextResponse } from "next/server";

export const PREVIEW_HEADER = "x-datastack-preview";

export const FEATURE_LINEAGE_HEADER = "x-datastack-feature-lineage";
export const FEATURE_COST_MANAGEMENT_HEADER = "x-datastack-feature-cost-management";
export const FEATURE_ORCHESTRATION_HEADER = "x-datastack-feature-orchestration";
export const FEATURE_DATA_QUALITY_HEADER = "x-datastack-feature-data-quality";
export const FEATURE_QUERY_INTELLIGENCE_HEADER = "x-datastack-feature-query-intelligence";
export const FEATURE_GOVERNANCE_HEADER = "x-datastack-feature-governance";
export const FEATURE_STREAMING_HEADER = "x-datastack-feature-streaming";
export const FEATURE_MLOPS_HEADER = "x-datastack-feature-mlops";
export const FEATURE_ALERTS_HEADER = "x-datastack-feature-alerts";
export const FEATURE_CATALOG_HEADER = "x-datastack-feature-catalog";
export const FEATURE_ANALYTICS_HEADER = "x-datastack-feature-analytics";
export const FEATURE_RBAC_HEADER = "x-datastack-feature-rbac";
export const FEATURE_OBSERVABILITY_HEADER = "x-datastack-feature-observability";
export const FEATURE_DATA_APPS_HEADER = "x-datastack-feature-data-apps";

export function isPreviewEnabled(request: NextRequest): boolean {
  return request.headers.get(PREVIEW_HEADER) === "true";
}

export function isFeatureEnabled(request: NextRequest, featureName: string): boolean {
  return request.headers.get(featureName) === "true";
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

export function featureRequiredResponse(featureName: string): NextResponse {
  return NextResponse.json(
    {
      error: "FeatureRequired",
      message: `This endpoint requires the ${featureName} feature flag. Set the ${featureName}: true header to access this functionality.`,
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
