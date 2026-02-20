import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/sql/warehouses/create:
 *   post:
 *     summary: Create SQL warehouse
 *     description: Create a new SQL warehouse (preview only)
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
 *               clusterSize:
 *                 type: string
 *               autoStopMinutes:
 *                 type: integer
 *               enableServerless:
 *                 type: boolean
 *               channel:
 *                 type: string
 *               tags:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isPreviewEnabled(request)) {
    return previewRequiredResponse();
  }

  const body = (await request.json()) as {
    name: string;
    clusterSize?: string;
    autoStopMinutes?: number;
    enableServerless?: boolean;
    channel?: string;
    tags?: Record<string, string>;
  };

  const warehouseId = `wh-${Date.now()}`;
  return NextResponse.json(
    {
      id: warehouseId,
      name: body.name,
      clusterSize: body.clusterSize ?? "Small",
      state: "STARTING",
      autoStopMinutes: body.autoStopMinutes ?? 15,
      enableServerless: body.enableServerless ?? false,
      channel: body.channel ?? "CURRENT",
      tags: body.tags ?? {},
      jdbcUrl: `jdbc:datastack:sql://${warehouseId}.us-west-2.datastack.cloud:443`,
      odbcUrl: `Driver={DataStack};Server=${warehouseId}.us-west-2.datastack.cloud;Port=443`,
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
