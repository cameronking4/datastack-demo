import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_LINEAGE_HEADER } from "@/lib/api/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogName: string; schemaName: string; tableName: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_LINEAGE_HEADER)) {
    return featureRequiredResponse(FEATURE_LINEAGE_HEADER);
  }

  const { catalogName, schemaName, tableName } = await params;
  const fqn = `${catalogName}.${schemaName}.${tableName}`;

  return NextResponse.json({
    table: fqn,
    upstream: [
      { table: `${catalogName}.${schemaName}.raw_events`, type: "direct", transformationType: "SELECT" },
      { table: `${catalogName}.${schemaName}.dim_users`, type: "direct", transformationType: "JOIN" },
    ],
    downstream: [
      { table: `${catalogName}.${schemaName}.report_daily`, type: "direct", transformationType: "AGGREGATE" },
    ],
    depth: 2,
    lastScannedAt: "2025-12-01T10:00:00Z",
  });
}
