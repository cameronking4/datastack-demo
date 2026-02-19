import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/environments:
 *   get:
 *     summary: List environments
 *     description: List deployment environments with promotion rules and access controls
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create environment
 *     description: Create a new deployment environment with approval and promotion configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - workspaceId
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               workspaceId:
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
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    environments: [
      {
        id: "env-dev",
        name: "Development",
        slug: "development",
        workspaceId: "ws-001",
        description: "Development and testing",
        color: "#22c55e",
        promotionRules: { requiresApproval: false, approvers: [], autoPromoteFrom: null, requiredChecks: [] },
        accessControl: { allowedRoles: ["admin", "editor", "viewer"], allowedTeamIds: [] },
        variables: { LOG_LEVEL: "debug", CACHE_TTL: "60" },
        protected: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-06-01T10:00:00Z",
        activeDeployments: 3,
      },
      {
        id: "env-staging",
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
      },
      {
        id: "env-prod",
        name: "Production",
        slug: "production",
        workspaceId: "ws-001",
        description: "Live production environment",
        color: "#ef4444",
        promotionRules: { requiresApproval: true, approvers: ["u1", "u2"], autoPromoteFrom: "staging", requiredChecks: ["tests", "lint", "security-scan"] },
        accessControl: { allowedRoles: ["admin"], allowedTeamIds: ["team-platform"] },
        variables: { LOG_LEVEL: "warn", CACHE_TTL: "3600" },
        protected: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-06-05T16:00:00Z",
        activeDeployments: 1,
      },
    ],
    totalCount: 3,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    slug: string;
    workspaceId: string;
    description?: string;
    color?: string;
    promotionRules?: Record<string, unknown>;
    accessControl?: Record<string, unknown>;
    variables?: Record<string, string>;
    protected?: boolean;
  };
  return NextResponse.json(
    {
      id: "env-new",
      name: body.name,
      slug: body.slug,
      workspaceId: body.workspaceId,
      description: body.description ?? "",
      color: body.color ?? "#6b7280",
      promotionRules: body.promotionRules ?? { requiresApproval: false, approvers: [], autoPromoteFrom: null, requiredChecks: [] },
      accessControl: body.accessControl ?? { allowedRoles: ["admin", "editor"], allowedTeamIds: [] },
      variables: body.variables ?? {},
      protected: body.protected ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeDeployments: 0,
    },
    { status: 201 }
  );
}
