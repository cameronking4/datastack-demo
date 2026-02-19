import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/pipelines/{pipelineId}/runs:
 *   get:
 *     summary: List pipeline runs
 *     description: List execution history for a pipeline with duration, status, and error details
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RUNNING, SUCCESS, FAILED, CANCELLED, QUEUED]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Trigger pipeline run
 *     description: Manually trigger a pipeline execution with optional parameter overrides
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameters:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, critical]
 *               dryRun:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 20 });
  const requestId = getRequestId(request);
  const statusFilter = searchParams.get("status");

  const runs = [
    {
      id: "run-0001",
      pipelineId,
      status: "SUCCESS",
      triggeredBy: "schedule",
      startedAt: "2024-08-15T14:00:00Z",
      finishedAt: "2024-08-15T14:12:34Z",
      durationMs: 754000,
      rowsProcessed: 1245890,
      bytesProcessed: 2147483648,
      error: null,
    },
    {
      id: "run-0002",
      pipelineId,
      status: "FAILED",
      triggeredBy: "manual",
      startedAt: "2024-08-15T12:00:00Z",
      finishedAt: "2024-08-15T12:05:12Z",
      durationMs: 312000,
      rowsProcessed: 0,
      bytesProcessed: 0,
      error: { code: "SOURCE_UNAVAILABLE", message: "Connection to source timed out after 300s" },
    },
    {
      id: "run-0003",
      pipelineId,
      status: "RUNNING",
      triggeredBy: "schedule",
      startedAt: "2024-08-15T16:00:00Z",
      finishedAt: null,
      durationMs: null,
      rowsProcessed: 543210,
      bytesProcessed: 1073741824,
      error: null,
    },
  ];

  let filtered = runs;
  if (statusFilter) filtered = filtered.filter((r) => r.status === statusFilter);

  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("runs", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const requestId = getRequestId(request);

  let body: {
    parameters?: Record<string, string>;
    priority?: string;
    dryRun?: boolean;
  } = {};
  try {
    body = await request.json();
  } catch {
    // no body is fine
  }

  return created(
    {
      id: "run-" + Date.now(),
      pipelineId,
      status: body.dryRun ? "DRY_RUN_COMPLETE" : "QUEUED",
      triggeredBy: "manual",
      parameters: body.parameters ?? {},
      priority: body.priority ?? "normal",
      dryRun: body.dryRun ?? false,
      startedAt: body.dryRun ? new Date().toISOString() : null,
      finishedAt: body.dryRun ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    },
    { requestId }
  );
}
