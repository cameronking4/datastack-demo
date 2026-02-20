import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_MLOPS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/ml/models:
 *   post:
 *     summary: Register model
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               framework:
 *                 type: string
 *               version:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
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
    framework?: string;
    version?: string;
    description?: string;
    tags?: Record<string, string>;
  };

  return NextResponse.json(
    {
      modelId: "model-" + Date.now(),
      name: body.name ?? "Untitled Model",
      framework: body.framework ?? "sklearn",
      version: body.version ?? "1.0.0",
      description: body.description ?? "",
      tags: body.tags ?? {},
      status: "REGISTERED",
      stage: "DEVELOPMENT",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
