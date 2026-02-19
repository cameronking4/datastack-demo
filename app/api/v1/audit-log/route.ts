import { NextRequest } from "next/server";
import {
  listResponse,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/audit-log:
 *   get:
 *     summary: List audit log entries
 *     description: Query the audit log for user and system actions with filtering by actor, action, resource, and time range
 *     parameters:
 *       - in: query
 *         name: actor
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [create, update, delete, deploy, execute, login, logout, invite, revoke]
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *           enum: [pipeline, cluster, stack, connection, secret, webhook, user, api_key]
 *       - in: query
 *         name: resourceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: until
 *         schema:
 *           type: string
 *           format: date-time
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
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 50 });
  const requestId = getRequestId(request);

  const actorFilter = searchParams.get("actor");
  const actionFilter = searchParams.get("action");
  const resourceTypeFilter = searchParams.get("resourceType");
  const resourceIdFilter = searchParams.get("resourceId");

  const entries = [
    {
      id: "audit-001",
      timestamp: "2024-08-15T14:30:00Z",
      actor: { id: "user-001", email: "ada@datastack.dev", type: "user" },
      action: "deploy",
      resourceType: "stack",
      resourceId: "stack-001",
      resourceName: "Analytics Platform",
      details: { version: "2.4.1", environment: "production", deploymentId: "deploy-042" },
      ipAddress: "10.0.1.50",
      userAgent: "DataStack-CLI/1.5.0",
    },
    {
      id: "audit-002",
      timestamp: "2024-08-15T13:00:00Z",
      actor: { id: "user-002", email: "bob@datastack.dev", type: "user" },
      action: "create",
      resourceType: "pipeline",
      resourceId: "pipe-003",
      resourceName: "Customer Churn Model",
      details: { type: "batch", source: "conn-pg-001", sink: "conn-warehouse-001" },
      ipAddress: "10.0.1.51",
      userAgent: "Mozilla/5.0",
    },
    {
      id: "audit-003",
      timestamp: "2024-08-15T12:00:00Z",
      actor: { id: "system", email: null, type: "system" },
      action: "execute",
      resourceType: "pipeline",
      resourceId: "pipe-001",
      resourceName: "User Events ETL",
      details: { runId: "run-0001", trigger: "schedule", status: "SUCCESS" },
      ipAddress: null,
      userAgent: null,
    },
    {
      id: "audit-004",
      timestamp: "2024-08-15T10:00:00Z",
      actor: { id: "user-003", email: "carol@datastack.dev", type: "user" },
      action: "revoke",
      resourceType: "api_key",
      resourceId: "key-old-001",
      resourceName: "Legacy CI Key",
      details: { reason: "rotation" },
      ipAddress: "10.0.1.52",
      userAgent: "DataStack-CLI/1.5.0",
    },
  ];

  let filtered = entries;
  if (actorFilter) filtered = filtered.filter((e) => e.actor.email === actorFilter || e.actor.id === actorFilter);
  if (actionFilter) filtered = filtered.filter((e) => e.action === actionFilter);
  if (resourceTypeFilter) filtered = filtered.filter((e) => e.resourceType === resourceTypeFilter);
  if (resourceIdFilter) filtered = filtered.filter((e) => e.resourceId === resourceIdFilter);

  const totalCount = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return listResponse("entries", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}
