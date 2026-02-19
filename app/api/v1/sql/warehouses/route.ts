import { NextRequest } from "next/server";
import {
  listResponse,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

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
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const state = searchParams.get("state");

  const warehouses = [
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
    ];

  let filtered = warehouses;
  if (state) filtered = filtered.filter((w) => w.state === state);
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("warehouses", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
