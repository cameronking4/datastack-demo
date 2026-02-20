import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_ORCHESTRATION_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/jobs/{jobId}/sla:
 *   put:
 *     summary: Update job SLA
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxDurationMinutes:
 *                 type: integer
 *               deadlineCron:
 *                 type: string
 *               alertOnBreach:
 *                 type: boolean
 *               notifyEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *               priority:
 *                 type: string
 *               escalationPolicy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  if (!isFeatureEnabled(request, FEATURE_ORCHESTRATION_HEADER)) {
    return featureRequiredResponse(FEATURE_ORCHESTRATION_HEADER);
  }

  const { jobId } = await params;
  const body = (await request.json()) as {
    maxDurationMinutes?: number;
    deadlineCron?: string;
    alertOnBreach?: boolean;
    notifyEmails?: string[];
    priority?: "low" | "normal" | "high" | "critical";
    escalationPolicy?: string;
  };

  return NextResponse.json({
    jobId,
    sla: {
      maxDurationMinutes: body.maxDurationMinutes ?? 60,
      deadlineCron: body.deadlineCron ?? "0 0 6 * * ?",
      alertOnBreach: body.alertOnBreach ?? true,
      notifyEmails: body.notifyEmails ?? [],
      priority: body.priority ?? "normal",
      escalationPolicy: body.escalationPolicy ?? "default",
    },
    currentCompliance: {
      last30Days: { met: 28, breached: 2, complianceRate: 93.3 },
    },
    updatedAt: new Date().toISOString(),
  });
}
