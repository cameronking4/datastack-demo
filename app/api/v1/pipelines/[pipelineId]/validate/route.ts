import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/validate:
 *   post:
 *     summary: Validate pipeline
 *     description: Validate pipeline configuration before starting (preview only)
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullRefresh:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  if (!isPreviewEnabled(request)) {
    return previewRequiredResponse();
  }

  const { pipelineId } = await params;
  const body = (await request.json()) as {
    fullRefresh?: boolean;
  };

  return NextResponse.json({
    pipelineId,
    valid: true,
    fullRefresh: body.fullRefresh ?? false,
    diagnostics: [
      {
        severity: "INFO",
        message: "Pipeline configuration is valid",
        code: "VALIDATION_PASSED",
      },
    ],
    resolvedSettings: {
      target: "PRODUCTION",
      catalog: "main",
      schema: "bronze",
      photon: true,
    },
    estimatedResourceUsage: {
      clusterNodes: 4,
      estimatedDbuPerHour: 12.5,
    },
  });
}
