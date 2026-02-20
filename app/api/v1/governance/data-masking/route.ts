import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_GOVERNANCE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/governance/data-masking:
 *   post:
 *     summary: Create masking rule
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table:
 *                 type: string
 *               column:
 *                 type: string
 *               maskType:
 *                 type: string
 *               applyTo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_GOVERNANCE_HEADER)) {
    return featureRequiredResponse(FEATURE_GOVERNANCE_HEADER);
  }

  const body = (await request.json()) as {
    table?: string;
    column?: string;
    maskType?: string;
    applyTo?: string[];
  };

  return NextResponse.json(
    {
      maskingRuleId: "mask-" + Date.now(),
      table: body.table ?? "catalog.schema.users",
      column: body.column ?? "email",
      maskType: body.maskType ?? "PARTIAL",
      applyTo: body.applyTo ?? ["group:analysts"],
      example: { original: "user@example.com", masked: "u***@example.com" },
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
