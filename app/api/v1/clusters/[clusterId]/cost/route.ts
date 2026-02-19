import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_COST_MANAGEMENT_HEADER)) {
    return featureRequiredResponse(FEATURE_COST_MANAGEMENT_HEADER);
  }

  const { clusterId } = await params;

  return NextResponse.json({
    clusterId,
    period: { startDate: "2025-11-01", endDate: "2025-11-30" },
    totalCost: 3250.00,
    currency: "USD",
    computeHours: 720,
    idleHours: 180,
    idleCost: 812.50,
    utilizationPercent: 75.0,
    costPerHour: 4.51,
    recommendations: [
      "Consider enabling auto-termination after 15 minutes of inactivity",
      "Downsize to a smaller node type during off-peak hours",
    ],
  });
}
