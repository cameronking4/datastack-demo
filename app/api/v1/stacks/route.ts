import { NextRequest } from "next/server";
import {
  listResponse,
  created,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/stacks:
 *   get:
 *     summary: List stacks
 *     description: List composable infrastructure stacks with module graph, lifecycle state, and compliance metadata
 *     parameters:
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: [development, staging, production]
 *       - in: query
 *         name: lifecycleState
 *         schema:
 *           type: string
 *           enum: [DRAFT, ACTIVE, DEPLOYING, FAILED, DECOMMISSIONED]
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create stack
 *     description: Create a new composable infrastructure stack with module graph, policies, and drift detection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workspaceId
 *               - environment
 *               - modules
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *               owner:
 *                 type: string
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - provider
 *                     - resourceType
 *                     - resourceId
 *                   properties:
 *                     name:
 *                       type: string
 *                     provider:
 *                       type: string
 *                       enum: [aws, azure, gcp, datastack, custom]
 *                     resourceType:
 *                       type: string
 *                     resourceId:
 *                       type: string
 *                     version:
 *                       type: string
 *                     inputs:
 *                       type: object
 *                       additionalProperties: true
 *                     outputs:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dependsOn:
 *                       type: array
 *                       items:
 *                         type: string
 *                     healthCheck:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                         endpoint:
 *                           type: string
 *                         intervalSeconds:
 *                           type: integer
 *                         timeoutSeconds:
 *                           type: integer
 *               policies:
 *                 type: object
 *                 properties:
 *                   driftDetection:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                       intervalMinutes:
 *                         type: integer
 *                       autoRemediate:
 *                         type: boolean
 *                   rollback:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                       maxRevisions:
 *                         type: integer
 *                   approval:
 *                     type: object
 *                     properties:
 *                       required:
 *                         type: boolean
 *                       approvers:
 *                         type: array
 *                         items:
 *                           type: string
 *               compliance:
 *                 type: object
 *                 properties:
 *                   frameworks:
 *                     type: array
 *                     items:
 *                       type: string
 *                   dataClassification:
 *                     type: string
 *                     enum: [public, internal, confidential, restricted]
 *               tags:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               gitRepository:
 *                 type: string
 *               gitBranch:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);

  const environment = searchParams.get("environment");
  const lifecycleState = searchParams.get("lifecycleState");
  const owner = searchParams.get("owner");

  const stacks = [
    {
      id: "stack-001",
      name: "Analytics Platform",
      description: "End-to-end analytics pipeline with drift detection and compliance",
      workspaceId: "ws-001",
      environment: "production",
      owner: "platform-team@datastack.dev",
      revision: 14,
      lifecycleState: "ACTIVE",
      modules: [
        {
          name: "Storage",
          provider: "datastack",
          resourceType: "catalog",
          resourceId: "cat-001",
          version: "2.1.0",
          inputs: { storageLocation: "s3://acme-data/analytics" },
          outputs: ["catalogName", "storageUri"],
          dependsOn: [],
          healthCheck: { enabled: true, endpoint: "/health", intervalSeconds: 60, timeoutSeconds: 10 },
          status: "HEALTHY",
          lastDriftCheckAt: "2024-08-15T14:00:00Z",
          driftDetected: false,
        },
        {
          name: "Ingestion",
          provider: "datastack",
          resourceType: "pipeline",
          resourceId: "pipe-001",
          version: "3.0.1",
          inputs: { source: "conn-kafka-001", target: "catalog.bronze" },
          outputs: ["pipelineId", "lastRunStatus"],
          dependsOn: ["Storage"],
          healthCheck: { enabled: true, endpoint: "/api/v1/pipelines/pipe-001", intervalSeconds: 120, timeoutSeconds: 15 },
          status: "HEALTHY",
          lastDriftCheckAt: "2024-08-15T14:00:00Z",
          driftDetected: false,
        },
        {
          name: "Compute",
          provider: "aws",
          resourceType: "cluster",
          resourceId: "cluster-001",
          version: "1.5.0",
          inputs: { nodeType: "i3.xlarge", minWorkers: 2, maxWorkers: 8 },
          outputs: ["clusterId", "clusterUrl"],
          dependsOn: ["Storage"],
          healthCheck: { enabled: true, endpoint: "/api/v1/clusters/cluster-001", intervalSeconds: 60, timeoutSeconds: 10 },
          status: "HEALTHY",
          lastDriftCheckAt: "2024-08-15T14:00:00Z",
          driftDetected: false,
        },
      ],
      policies: {
        driftDetection: { enabled: true, intervalMinutes: 60, autoRemediate: false },
        rollback: { enabled: true, maxRevisions: 10 },
        approval: { required: true, approvers: ["ada@datastack.dev", "bob@datastack.dev"] },
      },
      compliance: {
        frameworks: ["SOC2", "GDPR"],
        dataClassification: "confidential",
        lastAuditAt: "2024-08-01T00:00:00Z",
        auditStatus: "COMPLIANT",
      },
      tags: { team: "platform", tier: "critical", costCenter: "eng-001" },
      gitRepository: "https://github.com/acme/analytics-stack",
      gitBranch: "main",
      createdAt: "2024-02-01T10:00:00Z",
      updatedAt: "2024-08-15T14:00:00Z",
      lastDeployedAt: "2024-08-15T14:30:00Z",
      lastDeployRevision: 14,
      lastDeployStatus: "SUCCESS",
    },
  ];

  let filtered = stacks;
  if (environment) filtered = filtered.filter((s) => s.environment === environment);
  if (lifecycleState) filtered = filtered.filter((s) => s.lifecycleState === lifecycleState);
  if (owner) filtered = filtered.filter((s) => s.owner === owner);

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("stacks", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    description?: string;
    workspaceId: string;
    environment: string;
    owner: string;
    modules: {
      name: string;
      provider: string;
      resourceType: string;
      resourceId: string;
      version?: string;
      inputs?: Record<string, unknown>;
      outputs?: string[];
      dependsOn?: string[];
      healthCheck?: { enabled: boolean; endpoint?: string; intervalSeconds?: number; timeoutSeconds?: number };
    }[];
    policies?: {
      driftDetection?: { enabled: boolean; intervalMinutes?: number; autoRemediate?: boolean };
      rollback?: { enabled: boolean; maxRevisions?: number };
      approval?: { required: boolean; approvers?: string[] };
    };
    compliance?: {
      frameworks?: string[];
      dataClassification?: string;
    };
    tags?: Record<string, string>;
    gitRepository?: string;
    gitBranch?: string;
  };
  const requestId = getRequestId(request);

  return created(
    {
      id: "stack-new",
      name: body.name,
      description: body.description ?? "",
      workspaceId: body.workspaceId,
      environment: body.environment,
      owner: body.owner,
      revision: 1,
      lifecycleState: "DRAFT",
      modules: body.modules.map((m) => ({
        ...m,
        version: m.version ?? "1.0.0",
        inputs: m.inputs ?? {},
        outputs: m.outputs ?? [],
        dependsOn: m.dependsOn ?? [],
        healthCheck: m.healthCheck ?? { enabled: false },
        status: "PENDING",
        lastDriftCheckAt: null,
        driftDetected: false,
      })),
      policies: {
        driftDetection: body.policies?.driftDetection ?? { enabled: false, intervalMinutes: 60, autoRemediate: false },
        rollback: body.policies?.rollback ?? { enabled: true, maxRevisions: 5 },
        approval: body.policies?.approval ?? { required: false, approvers: [] },
      },
      compliance: {
        frameworks: body.compliance?.frameworks ?? [],
        dataClassification: body.compliance?.dataClassification ?? "internal",
        lastAuditAt: null,
        auditStatus: "PENDING",
      },
      tags: body.tags ?? {},
      gitRepository: body.gitRepository ?? null,
      gitBranch: body.gitBranch ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastDeployedAt: null,
      lastDeployRevision: null,
      lastDeployStatus: null,
    },
    { requestId }
  );
}
