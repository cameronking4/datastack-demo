import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_LINEAGE_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/lineage/column/{catalogName}/{schemaName}/{tableName}/{columnName}:
 *   get:
 *     summary: Get column lineage
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
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogName: string; schemaName: string; tableName: string; columnName: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_LINEAGE_HEADER)) {
    return featureRequiredResponse(FEATURE_LINEAGE_HEADER);
  }

  const { catalogName, schemaName, tableName, columnName } = await params;
  const fqn = `${catalogName}.${schemaName}.${tableName}.${columnName}`;

  return NextResponse.json({
    column: fqn,
    dataType: "STRING",
    upstream: [
      {
        column: `${catalogName}.${schemaName}.raw_events.user_email`,
        transformation: "DIRECT_COPY",
        expression: null,
      },
    ],
    downstream: [
      {
        column: `${catalogName}.${schemaName}.report_daily.email`,
        transformation: "DIRECT_COPY",
        expression: null,
      },
    ],
    lastScannedAt: "2025-12-01T10:00:00Z",
  });
}
