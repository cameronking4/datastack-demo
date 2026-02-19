import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/lineage:
 *   get:
 *     summary: Get data lineage graph
 *     description: Retrieve the lineage graph for a resource showing upstream and downstream dependencies, column-level lineage, and transformation metadata
 *     parameters:
 *       - in: query
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: resourceType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [table, pipeline, dashboard]
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *           default: 3
 *       - in: query
 *         name: direction
 *         schema:
 *           type: string
 *           enum: [upstream, downstream, both]
 *           default: both
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const resourceId = searchParams.get("resourceId") ?? "unknown";
  const resourceType = searchParams.get("resourceType") ?? "table";
  const depth = parseInt(searchParams.get("depth") ?? "3", 10);
  const direction = searchParams.get("direction") ?? "both";

  return ok(
    {
      root: { id: resourceId, type: resourceType },
      depth,
      direction,
      nodes: [
        {
          id: resourceId,
          type: resourceType,
          name: "analytics.user_events",
          catalog: "main",
          schema: "analytics",
        },
        {
          id: "pipe-001",
          type: "pipeline",
          name: "User Events ETL",
        },
        {
          id: "raw-events",
          type: "table",
          name: "raw.clickstream_events",
          catalog: "main",
          schema: "raw",
        },
        {
          id: "dash-001",
          type: "dashboard",
          name: "Platform Overview",
        },
      ],
      edges: [
        {
          source: "raw-events",
          target: "pipe-001",
          type: "input",
          columns: [
            { source: "event_id", target: "event_id" },
            { source: "user_id", target: "user_id" },
            { source: "timestamp", target: "event_ts" },
          ],
        },
        {
          source: "pipe-001",
          target: resourceId,
          type: "output",
          columns: [
            { source: "event_id", target: "event_id" },
            { source: "user_id", target: "user_id" },
            { source: "event_ts", target: "event_ts" },
          ],
        },
        {
          source: resourceId,
          target: "dash-001",
          type: "consumed_by",
          columns: [],
        },
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalNodes: 4,
        totalEdges: 3,
      },
    },
    { requestId }
  );
}
