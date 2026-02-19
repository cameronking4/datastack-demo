import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_COST_MANAGEMENT_HEADER)) {
    return featureRequiredResponse(FEATURE_COST_MANAGEMENT_HEADER);
  }

  const body = (await request.json()) as {
    scope?: string;
    categories?: string[];
  };

  return NextResponse.json(
    {
      scope: body.scope ?? "workspace",
      recommendations: [
        {
          id: "rec-001",
          category: "compute",
          title: "Right-size underutilized clusters",
          estimatedMonthlySavings: 1200.00,
          effort: "LOW",
          details: "3 clusters are running at less than 20% utilization",
        },
        {
          id: "rec-002",
          category: "storage",
          title: "Archive cold data to cheaper storage tier",
          estimatedMonthlySavings: 450.00,
          effort: "MEDIUM",
          details: "15TB of data has not been accessed in 90+ days",
        },
        {
          id: "rec-003",
          category: "compute",
          title: "Enable spot instances for fault-tolerant workloads",
          estimatedMonthlySavings: 2100.00,
          effort: "HIGH",
          details: "Batch ETL jobs can tolerate interruptions",
        },
      ],
      totalEstimatedSavings: 3750.00,
      currency: "USD",
      generatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
