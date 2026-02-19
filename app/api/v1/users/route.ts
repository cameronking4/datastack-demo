import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List users
 *     description: List users with pagination, role, and team filters
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, editor, viewer, service_account]
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended, pending_verification]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create user
 *     description: Create a new user or service account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - email
 *               - role
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
 *               externalId:
 *                 type: string
 *               metadata:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") ?? "20", 10)));

  return NextResponse.json({
    data: [
      {
        id: "u1",
        displayName: "Ada Lovelace",
        email: "ada@datastack.dev",
        avatarUrl: "https://api.datastack.dev/avatars/ada.png",
        department: "Engineering",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-01T15:30:00Z",
        role: "admin",
        status: "active",
        lastLoginAt: "2024-06-10T08:00:00Z",
        mfaEnabled: true,
        teamIds: ["team-eng", "team-platform"],
        permissions: ["clusters:write", "jobs:write", "pipelines:write", "admin:users"],
        externalId: null,
      },
    ],
    pagination: {
      total: 1,
      page,
      perPage,
      hasMore: false,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    displayName: string;
    email: string;
    role: string;
    department?: string;
    teamIds?: string[];
    permissions?: string[];
    mfaEnabled?: boolean;
    externalId?: string;
    metadata?: Record<string, string>;
  };
  return NextResponse.json(
    {
      id: "u-new",
      displayName: body.displayName,
      email: body.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: body.role,
      status: "pending_verification",
      department: body.department ?? null,
      teamIds: body.teamIds ?? [],
      permissions: body.permissions ?? [],
      mfaEnabled: body.mfaEnabled ?? false,
      externalId: body.externalId ?? null,
      metadata: body.metadata ?? {},
    },
    { status: 201 }
  );
}
