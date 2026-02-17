import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ALERTS_HEADER } from "@/lib/api/preview";

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ALERTS_HEADER)) {
    return featureRequiredResponse(FEATURE_ALERTS_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    type?: string;
    config?: Record<string, string>;
  };

  return NextResponse.json(
    {
      channelId: "channel-" + Date.now(),
      name: body.name ?? "Default Channel",
      type: body.type ?? "EMAIL",
      config: body.config ?? { recipients: "alerts@datastack.dev" },
      status: "ACTIVE",
      verified: true,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
