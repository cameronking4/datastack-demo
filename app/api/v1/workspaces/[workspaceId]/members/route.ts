import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members:
 *   get:
 *     summary: List workspace members
 *     description: List members of a workspace with roles and last activity
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [owner, admin, editor, viewer]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Add workspace member
 *     description: Invite a user to the workspace with a specified role
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, editor, viewer]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const roleFilter = searchParams.get("role");

  const members = [
    {
      id: "member-001",
      workspaceId,
      userId: "user-001",
      email: "ada@datastack.dev",
      displayName: "Ada Lovelace",
      role: "owner",
      joinedAt: "2024-01-15T10:00:00Z",
      lastActiveAt: "2024-08-15T14:30:00Z",
    },
    {
      id: "member-002",
      workspaceId,
      userId: "user-002",
      email: "bob@datastack.dev",
      displayName: "Bob Martin",
      role: "admin",
      joinedAt: "2024-02-01T10:00:00Z",
      lastActiveAt: "2024-08-15T12:00:00Z",
    },
    {
      id: "member-003",
      workspaceId,
      userId: "user-003",
      email: "carol@datastack.dev",
      displayName: "Carol Shaw",
      role: "editor",
      joinedAt: "2024-03-15T10:00:00Z",
      lastActiveAt: "2024-08-14T18:00:00Z",
    },
  ];

  let filtered = members;
  if (roleFilter) filtered = filtered.filter((m) => m.role === roleFilter);

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("members", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    email: string;
    role: string;
    expiresAt?: string;
  };

  return created(
    {
      id: "member-" + Date.now(),
      workspaceId,
      userId: null,
      email: body.email,
      displayName: null,
      role: body.role,
      status: "invited",
      expiresAt: body.expiresAt ?? null,
      joinedAt: null,
      invitedAt: new Date().toISOString(),
      lastActiveAt: null,
    },
    { requestId }
  );
}
