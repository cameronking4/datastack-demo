import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/catalogs/{catalogName}/schemas/{schemaName}/tables:
 *   get:
 *     summary: List tables
 *     description: List tables in a schema
 *     parameters:
 *       - in: path
 *         name: catalogName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: schemaName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create table
 *     parameters:
 *       - in: path
 *         name: catalogName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: schemaName
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
 *               - name
 *               - columns
 *             properties:
 *               name:
 *                 type: string
 *               tableType:
 *                 type: string
 *               dataSourceFormat:
 *                 type: string
 *               columns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - type
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     nullable:
 *                       type: boolean
 *                     comment:
 *                       type: string
 *               storageLocation:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * GET /api/v1/catalogs/:catalogName/schemas/:schemaName/tables
 * List tables in a schema
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ catalogName: string; schemaName: string }> }
) {
  const { catalogName, schemaName } = await params;
  return NextResponse.json({
    tables: [
      {
        name: "raw_events",
        catalogName,
        schemaName,
        tableType: "MANAGED",
        dataSourceFormat: "DELTA",
        columns: [
          { name: "event_id", type: "STRING", nullable: false, comment: "Unique event identifier" },
          { name: "event_type", type: "STRING", nullable: false, comment: "Type of event" },
          { name: "payload", type: "STRING", nullable: true, comment: "JSON event payload" },
          { name: "created_at", type: "TIMESTAMP", nullable: false, comment: "Event timestamp" },
        ],
        storageLocation: `s3://acme-data-lake/${catalogName}/${schemaName}/raw_events`,
        rowCount: 15420000,
        sizeBytes: 4831000000,
        owner: "ada@datastack.dev",
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-06-10T02:15:33Z",
      },
      {
        name: "user_sessions",
        catalogName,
        schemaName,
        tableType: "MANAGED",
        dataSourceFormat: "DELTA",
        columns: [
          { name: "session_id", type: "STRING", nullable: false, comment: "Session identifier" },
          { name: "user_id", type: "STRING", nullable: false, comment: "User identifier" },
          { name: "started_at", type: "TIMESTAMP", nullable: false, comment: "Session start" },
          { name: "ended_at", type: "TIMESTAMP", nullable: true, comment: "Session end" },
          { name: "page_views", type: "INT", nullable: false, comment: "Number of page views" },
        ],
        storageLocation: `s3://acme-data-lake/${catalogName}/${schemaName}/user_sessions`,
        rowCount: 3200000,
        sizeBytes: 1024000000,
        owner: "ada@datastack.dev",
        createdAt: "2024-02-10T14:00:00Z",
        updatedAt: "2024-06-10T02:15:33Z",
      },
    ],
    totalCount: 2,
  });
}

/**
 * POST /api/v1/catalogs/:catalogName/schemas/:schemaName/tables
 * Create a new table in a schema
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ catalogName: string; schemaName: string }> }
) {
  const { catalogName, schemaName } = await params;
  const body = (await request.json()) as {
    name: string;
    tableType?: string;
    dataSourceFormat?: string;
    columns: { name: string; type: string; nullable?: boolean; comment?: string }[];
    storageLocation?: string;
    comment?: string;
  };
  return NextResponse.json(
    {
      name: body.name,
      catalogName,
      schemaName,
      tableType: body.tableType ?? "MANAGED",
      dataSourceFormat: body.dataSourceFormat ?? "DELTA",
      columns: body.columns,
      storageLocation: body.storageLocation ?? `s3://acme-data-lake/${catalogName}/${schemaName}/${body.name}`,
      comment: body.comment ?? "",
      rowCount: 0,
      sizeBytes: 0,
      owner: "api",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
