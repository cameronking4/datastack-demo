import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/data-contracts:
 *   get:
 *     summary: List data contracts
 *     description: List data contracts with optional filters for status, owner, and table
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, DRAFT, VIOLATED, EXPIRED, ARCHIVED]
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create data contract
 *     description: Create a new data contract between a producer and consumer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - producer
 *               - consumer
 *               - table
 *               - schema
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               producer:
 *                 type: object
 *                 required:
 *                   - team
 *                 properties:
 *                   team:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *               consumer:
 *                 type: object
 *                 required:
 *                   - team
 *                 properties:
 *                   team:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *               table:
 *                 type: string
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - column
 *                     - type
 *                   properties:
 *                     column:
 *                       type: string
 *                     type:
 *                       type: string
 *                     nullable:
 *                       type: boolean
 *                     piiClassification:
 *                       type: string
 *                       enum: [NONE, LOW, MEDIUM, HIGH]
 *               sla:
 *                 type: object
 *                 properties:
 *                   freshnessMinutes:
 *                     type: integer
 *                   uptimePercent:
 *                     type: number
 *                   maxNullPercent:
 *                     type: number
 *               qualityRules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     rule:
 *                       type: string
 *                     column:
 *                       type: string
 *                     threshold:
 *                       type: number
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const status = searchParams.get("status");
  const owner = searchParams.get("owner");
  const table = searchParams.get("table");

  const contracts = [
    {
      id: "dc-001",
      name: "User Events Contract",
      description: "Contract for user behavioral events ingested by the analytics pipeline",
      producer: { team: "platform-engineering", contactEmail: "platform@acme.com" },
      consumer: { team: "analytics", contactEmail: "analytics@acme.com" },
      table: "catalog_main.events.user_actions",
      status: "ACTIVE",
      version: "2.1.0",
      schema: [
        { column: "event_id", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "user_id", type: "STRING", nullable: false, piiClassification: "HIGH" },
        { column: "event_type", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "timestamp", type: "TIMESTAMP", nullable: false, piiClassification: "NONE" },
        { column: "properties", type: "MAP<STRING,STRING>", nullable: true, piiClassification: "MEDIUM" },
      ],
      sla: { freshnessMinutes: 15, uptimePercent: 99.9, maxNullPercent: 1.0 },
      qualityRules: [
        { rule: "NOT_NULL", column: "event_id", threshold: 100 },
        { rule: "UNIQUE", column: "event_id", threshold: 99.99 },
        { rule: "FRESHNESS", column: "timestamp", threshold: 15 },
      ],
      tags: { domain: "events", tier: "critical", compliance: "gdpr" },
      lastVerifiedAt: "2024-06-10T08:00:00Z",
      lastVerificationStatus: "PASSED",
      violationCount: 0,
      expiresAt: "2025-06-01T00:00:00Z",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-06-05T14:00:00Z",
      createdBy: "user-042",
    },
    {
      id: "dc-002",
      name: "Transaction Ledger Contract",
      description: "Financial transaction data contract for the billing team",
      producer: { team: "payments", contactEmail: "payments@acme.com" },
      consumer: { team: "billing", contactEmail: "billing@acme.com" },
      table: "catalog_main.finance.transactions",
      status: "VIOLATED",
      version: "1.3.0",
      schema: [
        { column: "txn_id", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "amount", type: "DECIMAL(18,2)", nullable: false, piiClassification: "NONE" },
        { column: "currency", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "customer_id", type: "STRING", nullable: false, piiClassification: "HIGH" },
        { column: "created_at", type: "TIMESTAMP", nullable: false, piiClassification: "NONE" },
      ],
      sla: { freshnessMinutes: 5, uptimePercent: 99.99, maxNullPercent: 0.0 },
      qualityRules: [
        { rule: "NOT_NULL", column: "txn_id", threshold: 100 },
        { rule: "RANGE", column: "amount", threshold: 0 },
        { rule: "FRESHNESS", column: "created_at", threshold: 5 },
      ],
      tags: { domain: "finance", tier: "critical", compliance: "sox" },
      lastVerifiedAt: "2024-06-10T07:30:00Z",
      lastVerificationStatus: "FAILED",
      violationCount: 3,
      expiresAt: "2025-12-31T00:00:00Z",
      createdAt: "2024-02-01T09:00:00Z",
      updatedAt: "2024-06-10T07:30:00Z",
      createdBy: "user-018",
    },
    {
      id: "dc-003",
      name: "Product Catalog Contract",
      description: "Product metadata contract for search and recommendation systems",
      producer: { team: "catalog-ops", contactEmail: "catalog@acme.com" },
      consumer: { team: "search", contactEmail: "search@acme.com" },
      table: "catalog_main.products.items",
      status: "DRAFT",
      version: "0.1.0",
      schema: [
        { column: "product_id", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "name", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "category", type: "STRING", nullable: true, piiClassification: "NONE" },
        { column: "price", type: "DECIMAL(10,2)", nullable: false, piiClassification: "NONE" },
      ],
      sla: { freshnessMinutes: 60, uptimePercent: 99.5, maxNullPercent: 5.0 },
      qualityRules: [
        { rule: "NOT_NULL", column: "product_id", threshold: 100 },
        { rule: "POSITIVE", column: "price", threshold: 100 },
      ],
      tags: { domain: "product", tier: "standard" },
      lastVerifiedAt: null,
      lastVerificationStatus: null,
      violationCount: 0,
      expiresAt: null,
      createdAt: "2024-06-01T11:00:00Z",
      updatedAt: "2024-06-01T11:00:00Z",
      createdBy: "user-055",
    },
  ];

  let filtered = contracts;
  if (status) filtered = filtered.filter((c) => c.status === status);
  if (owner) filtered = filtered.filter((c) => c.producer.team === owner || c.consumer.team === owner);
  if (table) filtered = filtered.filter((c) => c.table.includes(table));

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("dataContracts", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    producer: { team: string; contactEmail?: string };
    consumer: { team: string; contactEmail?: string };
    table: string;
    schema: { column: string; type: string; nullable?: boolean; piiClassification?: string }[];
    sla?: { freshnessMinutes?: number; uptimePercent?: number; maxNullPercent?: number };
    qualityRules?: { rule: string; column: string; threshold: number }[];
    tags?: Record<string, string>;
    expiresAt?: string;
  };

  const requestId = getRequestId(request);

  return created(
    {
      id: "dc-new",
      name: body.name,
      description: body.description ?? "",
      producer: body.producer,
      consumer: body.consumer,
      table: body.table,
      status: "DRAFT",
      version: "1.0.0",
      schema: body.schema,
      sla: body.sla ?? { freshnessMinutes: 60, uptimePercent: 99.0, maxNullPercent: 5.0 },
      qualityRules: body.qualityRules ?? [],
      tags: body.tags ?? {},
      lastVerifiedAt: null,
      lastVerificationStatus: null,
      violationCount: 0,
      expiresAt: body.expiresAt ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "api",
    },
    { requestId }
  );
}
