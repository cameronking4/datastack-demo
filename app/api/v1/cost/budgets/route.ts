import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_COST_MANAGEMENT_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/cost/budgets:
 *   post:
 *     summary: Create budget
 *     description: Create a cost budget with alert thresholds
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               monthlyLimit:
 *                 type: number
 *               alertThresholds:
 *                 type: array
 *                 items:
 *                   type: number
 *               notifyEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
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
