import { NextRequest } from "next/server";
import {
  listResponse,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/data-contracts/{contractId}/violations:
 *   get:
 *     summary: List contract violations
 *     description: List violations detected for a data contract with optional severity and date filters
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [CRITICAL, HIGH, MEDIUM, LOW]
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: resolved
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const severity = searchParams.get("severity");
  const resolved = searchParams.get("resolved");

  const violations = [
    {
      id: "viol-001",
      contractId,
      type: "FRESHNESS",
      severity: "CRITICAL",
      message: "Data freshness exceeded SLA threshold: 42 minutes (threshold: 15 minutes)",
      column: null,
      rule: "FRESHNESS",
      expectedValue: 15,
      actualValue: 42,
      detectedAt: "2024-06-09T22:15:00Z",
      resolvedAt: "2024-06-09T23:00:00Z",
      resolved: true,
      resolvedBy: "user-018",
      resolution: "Upstream pipeline was restarted and backfill completed",
    },
    {
      id: "viol-002",
      contractId,
      type: "QUALITY",
      severity: "HIGH",
      message: "Null percentage for column 'amount' exceeded threshold: 2.3% (threshold: 0%)",
      column: "amount",
      rule: "NOT_NULL",
      expectedValue: 0,
      actualValue: 2.3,
      detectedAt: "2024-06-10T06:30:00Z",
      resolvedAt: null,
      resolved: false,
      resolvedBy: null,
      resolution: null,
    },
    {
      id: "viol-003",
      contractId,
      type: "SCHEMA",
      severity: "MEDIUM",
      message: "Column 'metadata' type changed from MAP<STRING,STRING> to STRING",
      column: "metadata",
      rule: "SCHEMA_DRIFT",
      expectedValue: "MAP<STRING,STRING>",
      actualValue: "STRING",
      detectedAt: "2024-06-10T07:00:00Z",
      resolvedAt: null,
      resolved: false,
      resolvedBy: null,
      resolution: null,
    },
  ];

  let filtered = violations;
  if (severity) filtered = filtered.filter((v) => v.severity === severity);
  if (resolved !== null) filtered = filtered.filter((v) => v.resolved === (resolved === "true"));

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("violations", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
