import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get user profile including teams, permissions, and activity summary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update user
 *     description: Update user profile, role, teams, or permissions
 *     parameters:
 *       - in: path
 *         name: id
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
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, editor, viewer, service_account]
 *               department:
 *                 type: string
 *               teamIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               mfaEnabled:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete user
 *     description: Permanently delete a user. Active sessions will be revoked.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id,
    displayName: "Ada Lovelace",
    email: "ada@datastack.dev",
    avatarUrl: "https://api.datastack.dev/avatars/ada.png",
    department: "Engineering",
    role: "admin",
    status: "active",
    mfaEnabled: true,
    teamIds: ["team-eng", "team-platform"],
    permissions: ["clusters:write", "jobs:write", "pipelines:write", "admin:users"],
    externalId: null,
    metadata: {},
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T15:30:00Z",
    lastLoginAt: "2024-06-10T08:00:00Z",
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  return NextResponse.json({
    id,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return new NextResponse(null, { status: 204 });
}
