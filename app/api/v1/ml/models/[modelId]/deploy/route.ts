import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_MLOPS_HEADER)) {
    return featureRequiredResponse(FEATURE_MLOPS_HEADER);
  }

  const { modelId } = await params;
  const body = (await request.json()) as {
    environment?: string;
    instanceType?: string;
    replicas?: number;
  };

  return NextResponse.json(
    {
      deploymentId: "deploy-" + Date.now(),
      modelId,
      environment: body.environment ?? "staging",
      instanceType: body.instanceType ?? "ml.m5.large",
      replicas: body.replicas ?? 2,
      endpointUrl: `https://ml.datastack.dev/serve/${modelId}`,
      status: "DEPLOYING",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
