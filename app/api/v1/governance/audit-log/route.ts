import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_GOVERNANCE_HEADER } from "@/lib/api/preview";

export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_GOVERNANCE_HEADER)) {
    return featureRequiredResponse(FEATURE_GOVERNANCE_HEADER);
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)));

  return NextResponse.json({
    events: [
      {
        eventId: "evt-001",
        timestamp: "2025-11-30T14:30:00Z",
        user: "admin@datastack.dev",
        action: "GRANT",
        resource: "catalog.schema.sensitive_table",
        details: "Granted SELECT to group:analysts",
        ipAddress: "10.0.1.50",
      },
      {
        eventId: "evt-002",
        timestamp: "2025-11-30T15:00:00Z",
        user: "analyst@datastack.dev",
        action: "QUERY",
        resource: "catalog.schema.sensitive_table",
        details: "SELECT query on sensitive data",
        ipAddress: "10.0.2.100",
      },
    ],
    totalCount: 2,
    limit,
  });
}
