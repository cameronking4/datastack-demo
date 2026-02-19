import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

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
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 20 });
  const requestId = getRequestId(request);
  const role = searchParams.get("role");
  const teamId = searchParams.get("teamId");
  const status = searchParams.get("status");

  const users = [
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
    ];

  let filtered = users;
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (teamId) filtered = filtered.filter((u) => u.teamIds?.includes(teamId));
  if (status) filtered = filtered.filter((u) => u.status === status);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("users", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
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
  return created(
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
    { requestId }
  );
}
