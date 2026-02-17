import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_GOVERNANCE_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_GOVERNANCE_HEADER)) {
    return featureRequiredResponse(FEATURE_GOVERNANCE_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    resource?: string;
    principal?: string;
    permissions?: string[];
    conditions?: Record<string, string>;
  };

  return NextResponse.json(
    {
      policyId: "pol-" + Date.now(),
      name: body.name ?? "Default Access Policy",
      resource: body.resource ?? "catalog.schema.*",
      principal: body.principal ?? "group:analysts",
      permissions: body.permissions ?? ["SELECT", "DESCRIBE"],
      conditions: body.conditions ?? {},
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
