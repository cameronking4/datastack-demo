import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/deploy:
 *   post:
 *     summary: Deploy model
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               environment:
 *                 type: string
 *               instanceType:
 *                 type: string
 *               replicas:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 */
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
