import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sql/warehouses:
 *   get:
 *     summary: List SQL warehouses
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/sql/warehouses
 * List SQL warehouses in workspace
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    warehouses: [
      {
        id: "wh-001",
        name: "BI Warehouse",
        clusterSize: "Small",
        state: "RUNNING",
        jdbcUrl: "jdbc:datastack:sql://wh-001.us-west-2.datastack.cloud:443",
        odbcUrl:
          "Driver={DataStack};Server=wh-001.us-west-2.datastack.cloud;Port=443",
        createdAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "wh-002",
        name: "Ad-hoc SQL",
        clusterSize: "2X-Small",
        state: "STOPPED",
        jdbcUrl: "jdbc:datastack:sql://wh-002.us-west-2.datastack.cloud:443",
        odbcUrl:
          "Driver={DataStack};Server=wh-002.us-west-2.datastack.cloud;Port=443",
        createdAt: "2024-02-05T14:00:00Z",
      },
    ],
    totalCount: 2,
  });
}
