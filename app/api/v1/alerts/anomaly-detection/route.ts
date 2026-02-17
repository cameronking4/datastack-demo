import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ALERTS_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ALERTS_HEADER)) {
    return featureRequiredResponse(FEATURE_ALERTS_HEADER);
  }

  const body = (await request.json()) as {
    metric?: string;
    sensitivity?: string;
    lookbackDays?: number;
  };

  return NextResponse.json(
    {
      detectorId: "anomaly-" + Date.now(),
      metric: body.metric ?? "query.latency_p95",
      sensitivity: body.sensitivity ?? "MEDIUM",
      lookbackDays: body.lookbackDays ?? 30,
      algorithm: "ISOLATION_FOREST",
      status: "ACTIVE",
      baselineEstablished: true,
      recentAnomalies: [
        {
          timestamp: "2025-11-30T14:30:00Z",
          expectedValue: 120,
          actualValue: 450,
          severity: "HIGH",
          acknowledged: false,
        },
      ],
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
