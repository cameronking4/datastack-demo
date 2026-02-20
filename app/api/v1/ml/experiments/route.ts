import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/ml/experiments:
 *   post:
 *     summary: Create experiment
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               modelId:
 *                 type: string
 *               parameters:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_MLOPS_HEADER)) {
    return featureRequiredResponse(FEATURE_MLOPS_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    modelId?: string;
    parameters?: Record<string, unknown>;
  };

  return NextResponse.json(
    {
      experimentId: "exp-" + Date.now(),
      name: body.name ?? "Experiment Run",
      modelId: body.modelId ?? "model-001",
      parameters: body.parameters ?? { learningRate: 0.01, epochs: 100, batchSize: 32 },
      status: "RUNNING",
      startedAt: new Date().toISOString(),
      metrics: {},
    },
    { status: 201 }
  );
}
