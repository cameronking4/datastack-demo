import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/me/preferences
 * Get the current user's UI and notification preferences.
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

/**
 * PATCH /api/v1/me/preferences
 * Update the current user's preferences.
 */
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
