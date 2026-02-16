import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/secrets/scopes:
 *   get:
 *     summary: List secret scopes
 *     description: List all secret scopes in workspace
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create secret scope
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/secrets/scopes
 * List all secret scopes in workspace
 */
export async function GET() {
  return NextResponse.json({
    scopes: [
      {
        name: "aws-prod",
        backendType: "DATASTACK",
        secretsCount: 3,
        createdAt: "2024-01-15T10:00:00Z",
        createdBy: "ada@datastack.dev",
      },
      {
        name: "db-prod",
        backendType: "DATASTACK",
        secretsCount: 2,
        createdAt: "2024-02-01T12:00:00Z",
        createdBy: "ada@datastack.dev",
      },
      {
        name: "kafka-prod",
        backendType: "DATASTACK",
        secretsCount: 4,
        createdAt: "2024-03-05T11:00:00Z",
        createdBy: "bob@datastack.dev",
      },
    ],
    totalCount: 3,
  });
}

/**
 * POST /api/v1/secrets/scopes
 * Create a new secret scope
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    backendType?: string;
  };
  return NextResponse.json(
    {
      name: body.name,
      backendType: body.backendType ?? "DATASTACK",
      secretsCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
