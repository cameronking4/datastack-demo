import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_RBAC_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/roles:
 *   get:
 *     summary: List role assignments
 *     description: List user-role assignments in the workspace
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Assign role
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);

  const assignments = [
    { assignmentId: "a-001", userId: "user-1", userEmail: "ada@datastack.dev", roleId: "role-001", roleName: "Workspace Admin", assignedAt: "2024-01-15T10:00:00Z" },
    { assignmentId: "a-002", userId: "user-2", userEmail: "bob@datastack.dev", roleId: "role-002", roleName: "Data Engineer", assignedAt: "2024-02-01T00:00:00Z" },
    { assignmentId: "a-003", userId: "user-3", userEmail: "carol@datastack.dev", roleId: "role-003", roleName: "Analyst", assignedAt: "2024-03-10T00:00:00Z" },
  ];

  const totalCount = assignments.length;
  const start = (page - 1) * pageSize;
  const paged = assignments.slice(start, start + pageSize);

  return listResponse("assignments", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_RBAC_HEADER)) {
    return featureRequiredResponse(FEATURE_RBAC_HEADER);
  }
  const { workspaceId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { userId: string; roleId: string };

  return created(
    {
      assignmentId: "a-" + Date.now(),
      workspaceId,
      userId: body.userId,
      roleId: body.roleId,
      assignedAt: new Date().toISOString(),
      assignedBy: "api",
    },
    { requestId }
  );
}
