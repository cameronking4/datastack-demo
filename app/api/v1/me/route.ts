import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/me
 * Get the current authenticated user's profile.
 */
export async function GET(request: NextRequest) {
  const requestId = getRequestId(request);

  return ok(
    {
      id: "u1",
      displayName: "Ada Lovelace",
      email: "ada@datastack.dev",
      avatarUrl: "https://api.datastack.dev/avatars/ada.png",
      role: "admin",
      status: "active",
      department: "Engineering",
      teamIds: ["team-eng", "team-platform"],
      permissions: ["clusters:write", "jobs:write", "pipelines:write", "admin:users"],
      mfaEnabled: true,
      createdAt: "2024-01-15T10:00:00Z",
      lastLoginAt: "2024-06-10T08:00:00Z",
      preferredWorkspaceId: "ws-001",
    },
    { requestId }
  );
}
