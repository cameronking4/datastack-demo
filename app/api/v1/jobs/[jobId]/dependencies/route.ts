import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const { jobId } = await params;

  return NextResponse.json({
    jobId,
    upstream: [
      { jobId: "job-1001", name: "Raw Data Ingestion", status: "COMPLETED" },
      { jobId: "job-1002", name: "Schema Validation", status: "COMPLETED" },
    ],
    downstream: [
      { jobId: "job-1004", name: "Dashboard Refresh", status: "PENDING" },
    ],
    graph: {
      nodes: ["job-1001", "job-1002", jobId, "job-1004"],
      edges: [
        { from: "job-1001", to: jobId },
        { from: "job-1002", to: jobId },
        { from: jobId, to: "job-1004" },
      ],
    },
  });
}
