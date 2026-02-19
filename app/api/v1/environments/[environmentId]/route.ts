import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/environments/{environmentId}:
 *   get:
 *     summary: Get environment
 *     description: Get environment details including promotion rules, variables, and deployment count
 *     parameters:
 *       - in: path
 *         name: environmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update environment
 *     description: Update environment settings, promotion rules, or access controls
 *     parameters:
 *       - in: path
 *         name: environmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *               promotionRules:
 *                 type: object
 *                 properties:
 *                   requiresApproval:
 *                     type: boolean
 *                   approvers:
 *                     type: array
 *                     items:
 *                       type: string
 *                   autoPromoteFrom:
 *                     type: string
 *                   requiredChecks:
 *                     type: array
 *                     items:
 *                       type: string
 *               accessControl:
 *                 type: object
 *                 properties:
 *                   allowedRoles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   allowedTeamIds:
 *                     type: array
 *                     items:
 *                       type: string
 *               variables:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               protected:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete environment
 *     description: Delete an environment. Protected environments cannot be deleted.
 *     parameters:
 *       - in: path
 *         name: environmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ environmentId: string }> }
) {
  const { environmentId } = await params;
  return NextResponse.json({
    id: environmentId,
    name: "Staging",
    slug: "staging",
    workspaceId: "ws-001",
    description: "Pre-production validation",
    color: "#f59e0b",
    promotionRules: { requiresApproval: true, approvers: ["u1"], autoPromoteFrom: "development", requiredChecks: ["tests", "lint"] },
    accessControl: { allowedRoles: ["admin", "editor"], allowedTeamIds: ["team-eng"] },
    variables: { LOG_LEVEL: "info", CACHE_TTL: "300" },
    protected: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-05-15T14:00:00Z",
    activeDeployments: 2,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ environmentId: string }> }
) {
  const { environmentId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id: environmentId,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ environmentId: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
