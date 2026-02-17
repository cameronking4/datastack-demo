import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_LINEAGE_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceType: string; resourceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_LINEAGE_HEADER)) {
    return featureRequiredResponse(FEATURE_LINEAGE_HEADER);
  }

  const { resourceType, resourceId } = await params;

  return NextResponse.json({
    resourceType,
    resourceId,
    impactedResources: [
      { type: "table", id: "downstream_table_1", name: "report_daily", severity: "HIGH" },
      { type: "job", id: "job-2001", name: "Daily ETL", severity: "MEDIUM" },
      { type: "dashboard", id: "dash-101", name: "Executive Summary", severity: "LOW" },
    ],
    totalImpacted: 3,
    analysisTimestamp: new Date().toISOString(),
  });
}
