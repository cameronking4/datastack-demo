import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/catalogs/{catalogName}/schemas:
 *   get:
 *     summary: List schemas
 *     description: List schemas in a catalog
 *     parameters:
 *       - in: path
 *         name: catalogName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create schema
 *     parameters:
 *       - in: path
 *         name: catalogName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/catalogs/:catalogName/schemas
 * List schemas in a catalog
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ catalogName: string }> }
) {
  const { catalogName } = await params;
  return NextResponse.json({
    schemas: [
      {
        name: "bronze",
        catalogName,
        owner: "ada@datastack.dev",
        comment: "Raw ingested data",
        tablesCount: 12,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
      },
      {
        name: "silver",
        catalogName,
        owner: "ada@datastack.dev",
        comment: "Cleaned and transformed data",
        tablesCount: 8,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
      },
      {
        name: "gold",
        catalogName,
        owner: "bob@datastack.dev",
        comment: "Business-ready aggregated data",
        tablesCount: 5,
        createdAt: "2024-02-01T14:00:00Z",
        updatedAt: "2024-05-20T09:00:00Z",
      },
    ],
    totalCount: 3,
  });
}

/**
 * POST /api/v1/catalogs/:catalogName/schemas
 * Create a new schema in a catalog
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ catalogName: string }> }
) {
  const { catalogName } = await params;
  const body = (await request.json()) as {
    name: string;
    comment?: string;
    properties?: Record<string, string>;
  };
  return NextResponse.json(
    {
      name: body.name,
      catalogName,
      owner: "api",
      comment: body.comment ?? "",
      properties: body.properties ?? {},
      tablesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
