import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sql/warehouses/{warehouseId}/start:
 *   post:
 *     summary: Start SQL warehouse
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * POST /api/v1/sql/warehouses/:warehouseId/start
 * Start a stopped warehouse
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ warehouseId: string }> }
) {
  const { warehouseId } = await params;
  return NextResponse.json({
    id: warehouseId,
    name: "Ad-hoc SQL",
    clusterSize: "2X-Small",
    state: "STARTING",
    jdbcUrl: `jdbc:datastack:sql://${warehouseId}.us-west-2.datastack.cloud:443`,
    odbcUrl: `Driver={DataStack};Server=${warehouseId}.us-west-2.datastack.cloud;Port=443`,
    createdAt: "2024-02-05T14:00:00Z",
  });
}
