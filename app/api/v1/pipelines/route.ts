import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/pipelines:
 *   get:
 *     summary: List pipelines
 *     description: List Delta Live Tables pipelines with state and edition filters
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [RUNNING, IDLE, FAILED, STARTING, STOPPING]
 *       - in: query
 *         name: edition
 *         schema:
 *           type: string
 *           enum: [CORE, PRO, ADVANCED]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create pipeline
 *     description: Create a new Delta Live Tables pipeline with notification and library configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - workspaceId
 *               - target
 *             properties:
 *               name:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               target:
 *                 type: string
 *               catalog:
 *                 type: string
 *               schema:
 *                 type: string
 *               continuous:
 *                 type: boolean
 *               photon:
 *                 type: boolean
 *               edition:
 *                 type: string
 *                 enum: [CORE, PRO, ADVANCED]
 *               developmentMode:
 *                 type: boolean
 *               channel:
 *                 type: string
 *                 enum: [CURRENT, PREVIEW]
 *               notifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     emailRecipients:
 *                       type: array
 *                       items:
 *                         type: string
 *                     onStart:
 *                       type: boolean
 *                     onSuccess:
 *                       type: boolean
 *                     onFailure:
 *                       type: boolean
 *               libraries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     notebook:
 *                       type: object
 *                       properties:
 *                         path:
 *                           type: string
 *                     jar:
 *                       type: string
 *                     maven:
 *                       type: object
 *                       properties:
 *                         coordinates:
 *                           type: string
 *               clusterConfig:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                   nodeType:
 *                     type: string
 *                   numWorkers:
 *                     type: integer
 *                   autoscale:
 *                     type: object
 *                     properties:
 *                       minWorkers:
 *                         type: integer
 *                       maxWorkers:
 *                         type: integer
 *                       mode:
 *                         type: string
 *                         enum: [ENHANCED, LEGACY]
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10)));

  return NextResponse.json({
    pipelines: [
      {
        id: "pipe-001",
        name: "Bronze Ingestion",
        workspaceId: "ws-001",
        state: "RUNNING",
        target: "PRODUCTION",
        catalog: "main",
        schema: "bronze",
        continuous: true,
        photon: true,
        edition: "PRO",
        developmentMode: false,
        channel: "CURRENT",
        clusterConfig: {
          label: "default",
          nodeType: "i3.xlarge",
          numWorkers: 4,
          autoscale: { minWorkers: 2, maxWorkers: 8, mode: "ENHANCED" },
        },
        libraries: [
          { notebook: { path: "/Workspace/Pipelines/bronze_ingestion" } },
        ],
        notifications: [
          { emailRecipients: ["team@datastack.dev"], onStart: false, onSuccess: false, onFailure: true },
        ],
        createdAt: "2024-03-01T09:00:00Z",
        createdBy: "ada@datastack.dev",
        lastRunAt: "2024-06-10T02:00:00Z",
        lastRunStatus: "SUCCESS",
      },
      {
        id: "pipe-002",
        name: "Silver Transform",
        workspaceId: "ws-001",
        state: "IDLE",
        target: "DEVELOPMENT",
        catalog: "main",
        schema: "silver",
        continuous: false,
        photon: false,
        edition: "CORE",
        developmentMode: true,
        channel: "PREVIEW",
        clusterConfig: {
          label: "default",
          nodeType: "m5.xlarge",
          numWorkers: 2,
          autoscale: null,
        },
        libraries: [],
        notifications: [],
        createdAt: "2024-04-15T14:00:00Z",
        createdBy: "bob@datastack.dev",
        lastRunAt: null,
        lastRunStatus: null,
      },
    ],
    totalCount: 2,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    workspaceId: string;
    target: string;
    catalog?: string;
    schema?: string;
    continuous?: boolean;
    photon?: boolean;
    edition?: string;
    developmentMode?: boolean;
    channel?: string;
    notifications?: { emailRecipients?: string[]; onStart?: boolean; onSuccess?: boolean; onFailure?: boolean }[];
    libraries?: Record<string, unknown>[];
    clusterConfig?: Record<string, unknown>;
  };

  return NextResponse.json(
    {
      id: "pipe-new",
      name: body.name,
      workspaceId: body.workspaceId,
      state: "IDLE",
      target: body.target,
      catalog: body.catalog ?? "main",
      schema: body.schema ?? "default",
      continuous: body.continuous ?? false,
      photon: body.photon ?? false,
      edition: body.edition ?? "CORE",
      developmentMode: body.developmentMode ?? false,
      channel: body.channel ?? "CURRENT",
      notifications: body.notifications ?? [],
      libraries: body.libraries ?? [],
      clusterConfig: body.clusterConfig ?? null,
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
