import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const { jobId } = await params;
  const body = (await request.json()) as {
    maxDurationMinutes?: number;
    deadlineCron?: string;
    alertOnBreach?: boolean;
    notifyEmails?: string[];
  };

  return NextResponse.json({
    jobId,
    sla: {
      maxDurationMinutes: body.maxDurationMinutes ?? 60,
      deadlineCron: body.deadlineCron ?? "0 0 6 * * ?",
      alertOnBreach: body.alertOnBreach ?? true,
      notifyEmails: body.notifyEmails ?? [],
    },
    currentCompliance: {
      last30Days: { met: 28, breached: 2, complianceRate: 93.3 },
    },
    updatedAt: new Date().toISOString(),
  });
}
