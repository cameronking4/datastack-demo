import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/secrets:
 *   put:
 *     summary: Put secret
 *     description: Create or update a secret in a scope
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scope
 *               - key
 *               - value
 *             properties:
 *               scope:
 *                 type: string
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete secret
 *     description: Delete a secret from a scope
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * PUT /api/v1/secrets
 * Create or update a secret in a scope
 */
export async function PUT(request: NextRequest) {
  const body = (await request.json()) as {
    scope: string;
    key: string;
    value: string;
  };
  return NextResponse.json({
    scope: body.scope,
    key: body.key,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: "api",
  });
}

/**
 * DELETE /api/v1/secrets
 * Delete a secret from a scope
 */
export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as {
    scope: string;
    key: string;
  };
  return NextResponse.json({
    message: `Secret '${body.key}' deleted from scope '${body.scope}'.`,
  });
}
