import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/metrics:
 *   get:
 *     summary: Get model metrics
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_MLOPS_HEADER)) {
    return featureRequiredResponse(FEATURE_MLOPS_HEADER);
  }

  const { modelId } = await params;

  return NextResponse.json({
    modelId,
    version: "1.0.0",
    metrics: {
      accuracy: 0.945,
      precision: 0.932,
      recall: 0.958,
      f1Score: 0.945,
      auc: 0.978,
    },
    trainingMetrics: {
      loss: 0.142,
      validationLoss: 0.168,
      epochs: 100,
      trainingDurationSeconds: 3600,
    },
    datasetSize: 50000,
    lastEvaluatedAt: "2025-12-01T08:00:00Z",
  });
}
