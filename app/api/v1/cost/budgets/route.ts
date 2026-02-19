import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_COST_MANAGEMENT_HEADER)) {
    return featureRequiredResponse(FEATURE_COST_MANAGEMENT_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    monthlyLimit?: number;
    alertThresholds?: number[];
    notifyEmails?: string[];
  };

  return NextResponse.json(
    {
      budgetId: "budget-" + Date.now(),
      name: body.name ?? "Default Budget",
      monthlyLimit: body.monthlyLimit ?? 10000,
      alertThresholds: body.alertThresholds ?? [50, 80, 100],
      notifyEmails: body.notifyEmails ?? [],
      currentSpend: 0,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
