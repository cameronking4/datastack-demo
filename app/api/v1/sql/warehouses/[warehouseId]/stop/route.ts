import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sql/warehouses/{warehouseId}/stop:
 *   post:
 *     summary: Stop SQL warehouse
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
 * POST /api/v1/sql/warehouses/:warehouseId/stop
 * Stop a running warehouse
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ warehouseId: string }> }
) {
  const { warehouseId } = await params;
  return NextResponse.json({
    id: warehouseId,
    name: "BI Warehouse",
    clusterSize: "Small",
    state: "STOPPING",
    jdbcUrl: `jdbc:datastack:sql://${warehouseId}.us-west-2.datastack.cloud:443`,
    odbcUrl: `Driver={DataStack};Server=${warehouseId}.us-west-2.datastack.cloud;Port=443`,
    createdAt: "2024-01-20T10:00:00Z",
  });
}
