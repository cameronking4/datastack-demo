import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/jobs/dag:
 *   post:
 *     summary: Get job DAG
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    tasks?: { taskId: string; dependsOn?: string[] }[];
  };

  return NextResponse.json(
    {
      dagId: "dag-" + Date.now(),
      name: body.name ?? "Untitled DAG",
      tasks: body.tasks ?? [],
      status: "CREATED",
      schedule: null,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
