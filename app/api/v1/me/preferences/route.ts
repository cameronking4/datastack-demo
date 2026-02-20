import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/me/preferences:
 *   get:
 *     summary: Get user preferences
 *     description: Get the current user's UI and notification preferences
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update user preferences
 *     description: Update the current user's preferences
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               defaultPageSize:
 *                 type: integer
 *               timezone:
 *                 type: string
 *               dateFormat:
 *                 type: string
 *               notifications:
 *                 type: object
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);

  return ok(
    {
      theme: "system",
      defaultPageSize: 25,
      timezone: "America/Los_Angeles",
      dateFormat: "YYYY-MM-DD",
      notifications: {
        emailDigest: "weekly",
        slackEnabled: true,
        jobAlerts: true,
        deploymentAlerts: true,
      },
    },
    { requestId }
  );
}

export async function PATCH(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as Record<string, unknown>;

  return ok(
    {
      theme: (body.theme as string) ?? "system",
      defaultPageSize: (body.defaultPageSize as number) ?? 25,
      timezone: (body.timezone as string) ?? "America/Los_Angeles",
      dateFormat: (body.dateFormat as string) ?? "YYYY-MM-DD",
      notifications: { ...(body.notifications as object) },
    },
    { requestId }
  );
}
