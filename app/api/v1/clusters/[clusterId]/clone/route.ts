import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled, previewRequiredResponse } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/clusters/{clusterId}/clone:
 *   post:
 *     summary: Clone cluster
 *     description: Clone an existing cluster (preview only)
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *               overrideTags:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  if (!isPreviewEnabled(request)) {
    return previewRequiredResponse();
  }

  const { clusterId } = await params;
  const body = (await request.json()) as {
    newName?: string;
    overrideTags?: Record<string, string>;
  };

  return NextResponse.json(
    {
      id: `${clusterId}-clone`,
      sourceClusterId: clusterId,
      name: body.newName ?? "Analytics Cluster (clone)",
      clusterSize: "Medium",
      region: "us-east-1",
      state: "PENDING",
      sparkVersion: "3.5.x-scala2.12",
      nodeType: "i3.xlarge",
      numWorkers: 4,
      autoTerminationMinutes: 30,
      tags: body.overrideTags ?? {},
      createdAt: new Date().toISOString(),
      createdBy: "api",
    },
    { status: 201 }
  );
}
