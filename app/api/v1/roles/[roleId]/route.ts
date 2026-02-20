import { NextRequest, NextResponse } from "next/server";
import { getRequestId, ok } from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_RBAC_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/roles/{roleId}:
 *   get:
 *     summary: Get role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const { roleId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      roleId,
      name: "Data Engineer",
      description: "Pipelines, jobs, clusters, and catalog write",
      workspaceId: "ws-001",
      permissions: ["pipelines:read", "pipelines:write", "jobs:read", "jobs:write", "clusters:read", "clusters:write", "catalog:read", "catalog:write"],
      isSystem: false,
      createdAt: "2024-03-15T00:00:00Z",
      updatedAt: "2024-07-20T00:00:00Z",
      assignedUserCount: 12,
    },
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const { roleId } = await params;
  const body = (await request.json()) as { name?: string; description?: string; permissions?: string[] };
  const requestId = getRequestId(request);

  return ok(
    {
      roleId,
      name: body.name ?? "Data Engineer",
      description: body.description ?? "Pipelines, jobs, clusters, and catalog write",
      workspaceId: "ws-001",
      permissions: body.permissions ?? ["pipelines:read", "pipelines:write", "jobs:read", "jobs:write"],
      isSystem: false,
      updatedAt: new Date().toISOString(),
    },
    { requestId }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  await params;
  return new NextResponse(null, { status: 204 });
}
