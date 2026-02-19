import { NextRequest } from "next/server";
import {
  ok,
  noContent,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/data-contracts/{contractId}:
 *   get:
 *     summary: Get data contract
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update data contract
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, DRAFT, EXPIRED, ARCHIVED]
 *               producer:
 *                 type: object
 *                 properties:
 *                   team:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *               consumer:
 *                 type: object
 *                 properties:
 *                   team:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     column:
 *                       type: string
 *                     type:
 *                       type: string
 *                     nullable:
 *                       type: boolean
 *                     piiClassification:
 *                       type: string
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
 *       200:
 *         description: Success
 *   delete:
 *     summary: Delete data contract
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      id: contractId,
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
    { requestId }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    status?: string;
    producer?: { team?: string; contactEmail?: string };
    consumer?: { team?: string; contactEmail?: string };
    schema?: { column: string; type: string; nullable?: boolean; piiClassification?: string }[];
    sla?: { freshnessMinutes?: number; uptimePercent?: number; maxNullPercent?: number };
    qualityRules?: { rule: string; column: string; threshold: number }[];
    tags?: Record<string, string>;
    expiresAt?: string;
  };
  const requestId = getRequestId(request);

  return ok(
    {
      id: contractId,
      name: body.name ?? "User Events Contract",
      description: body.description ?? "Contract for user behavioral events",
      producer: body.producer ?? { team: "platform-engineering", contactEmail: "platform@acme.com" },
      consumer: body.consumer ?? { team: "analytics", contactEmail: "analytics@acme.com" },
      table: "catalog_main.events.user_actions",
      status: body.status ?? "ACTIVE",
      version: "2.2.0",
      schema: body.schema ?? [
        { column: "event_id", type: "STRING", nullable: false, piiClassification: "NONE" },
        { column: "user_id", type: "STRING", nullable: false, piiClassification: "HIGH" },
      ],
      sla: body.sla ?? { freshnessMinutes: 15, uptimePercent: 99.9, maxNullPercent: 1.0 },
      qualityRules: body.qualityRules ?? [],
      tags: body.tags ?? { domain: "events", tier: "critical" },
      lastVerifiedAt: "2024-06-10T08:00:00Z",
      lastVerificationStatus: "PASSED",
      violationCount: 0,
      expiresAt: body.expiresAt ?? "2025-06-01T00:00:00Z",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: new Date().toISOString(),
      createdBy: "user-042",
    },
    { requestId }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  await params;
  const requestId = getRequestId(request);
  return noContent({ requestId });
}
