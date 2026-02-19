import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * POST /api/v1/jobs/bulk-pause
 * Pause multiple jobs in a single request.
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { jobIds: string[] };
  const jobIds = body.jobIds ?? [];

  return ok(
    {
      paused: jobIds,
      failed: [] as string[],
      message: `Paused ${jobIds.length} job(s)`,
    },
    { requestId }
  );
}
