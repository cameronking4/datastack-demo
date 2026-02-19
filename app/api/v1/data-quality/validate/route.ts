import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_QUALITY_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_DATA_QUALITY_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_QUALITY_HEADER);
  }

  const body = (await request.json()) as {
    table?: string;
    ruleIds?: string[];
  };

  return NextResponse.json({
    validationId: "val-" + Date.now(),
    table: body.table ?? "catalog.schema.table",
    rulesEvaluated: 5,
    results: [
      { ruleId: "rule-001", name: "Not Null Check", status: "PASSED", recordsChecked: 100000, recordsFailed: 0 },
      { ruleId: "rule-002", name: "Unique Constraint", status: "PASSED", recordsChecked: 100000, recordsFailed: 0 },
      { ruleId: "rule-003", name: "Range Validation", status: "FAILED", recordsChecked: 100000, recordsFailed: 42 },
    ],
    overallStatus: "FAILED",
    completedAt: new Date().toISOString(),
  });
}
