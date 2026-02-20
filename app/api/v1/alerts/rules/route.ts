import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ALERTS_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/alerts/rules:
 *   post:
 *     summary: Create alert rule
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               metric:
 *                 type: string
 *               condition:
 *                 type: string
 *               threshold:
 *                 type: number
 *               severity:
 *                 type: string
 *               channels:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_ALERTS_HEADER)) {
    return featureRequiredResponse(FEATURE_ALERTS_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    metric?: string;
    condition?: string;
    threshold?: number;
    severity?: string;
    channels?: string[];
  };

  return NextResponse.json(
    {
      ruleId: "alert-rule-" + Date.now(),
      name: body.name ?? "Untitled Alert Rule",
      metric: body.metric ?? "job.failure_rate",
      condition: body.condition ?? "GREATER_THAN",
      threshold: body.threshold ?? 0.05,
      severity: body.severity ?? "HIGH",
      channels: body.channels ?? ["email"],
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
