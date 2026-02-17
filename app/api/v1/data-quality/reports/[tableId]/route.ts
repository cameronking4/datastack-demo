import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_QUALITY_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_DATA_QUALITY_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_QUALITY_HEADER);
  }

  const { tableId } = await params;

  return NextResponse.json({
    tableId,
    qualityScore: 94.5,
    totalRules: 12,
    passingRules: 11,
    failingRules: 1,
    metrics: {
      completeness: 99.8,
      uniqueness: 100.0,
      accuracy: 97.2,
      consistency: 95.0,
      timeliness: 100.0,
    },
    trend: [
      { date: "2025-11-28", score: 92.0 },
      { date: "2025-11-29", score: 93.5 },
      { date: "2025-11-30", score: 94.5 },
    ],
    lastValidatedAt: "2025-11-30T23:00:00Z",
  });
}
