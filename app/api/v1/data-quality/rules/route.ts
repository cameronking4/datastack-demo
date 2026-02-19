import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_DATA_QUALITY_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_DATA_QUALITY_HEADER)) {
    return featureRequiredResponse(FEATURE_DATA_QUALITY_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    table?: string;
    column?: string;
    ruleType?: string;
    expression?: string;
    severity?: string;
  };

  return NextResponse.json(
    {
      ruleId: "rule-" + Date.now(),
      name: body.name ?? "Not Null Check",
      table: body.table ?? "catalog.schema.table",
      column: body.column ?? "id",
      ruleType: body.ruleType ?? "NOT_NULL",
      expression: body.expression ?? null,
      severity: body.severity ?? "HIGH",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
