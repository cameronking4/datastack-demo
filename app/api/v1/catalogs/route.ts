import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/catalogs:
 *   get:
 *     summary: List catalogs
 *     description: List Unity Catalog catalogs in workspace
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create catalog
 *     description: Create a new catalog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               comment:
 *                 type: string
 *               properties:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               isolation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/catalogs
 * List Unity Catalog catalogs in workspace
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    catalogs: [
      {
        name: "main",
        owner: "ada@datastack.dev",
        comment: "Primary production catalog",
        properties: { environment: "production" },
        isolation: "OPEN",
        schemasCount: 5,
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
        createdBy: "ada@datastack.dev",
      },
      {
        name: "sandbox",
        owner: "bob@datastack.dev",
        comment: "Development and experimentation catalog",
        properties: { environment: "development" },
        isolation: "ISOLATED",
        schemasCount: 3,
        createdAt: "2024-02-15T10:00:00Z",
        updatedAt: "2024-05-20T09:00:00Z",
        createdBy: "bob@datastack.dev",
      },
    ],
    totalCount: 2,
    pageSize,
  });
}

/**
 * POST /api/v1/catalogs
 * Create a new catalog
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    comment?: string;
    properties?: Record<string, string>;
    isolation?: string;
  };
  return NextResponse.json(
    {
      name: body.name,
      owner: "api",
      comment: body.comment ?? "",
      properties: body.properties ?? {},
      isolation: body.isolation ?? "OPEN",
      schemasCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
