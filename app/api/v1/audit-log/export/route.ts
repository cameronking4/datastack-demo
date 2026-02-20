import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * POST /api/v1/audit-log/export
 * Request an audit log export (async job; download URL provided when ready).
 */
export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    since?: string;
    until?: string;
    format?: "json" | "csv";
    resourceTypes?: string[];
  };

  return created(
    {
      exportId: "export-" + Date.now(),
      status: "pending",
      format: body.format ?? "json",
      since: body.since ?? null,
      until: body.until ?? null,
      resourceTypes: body.resourceTypes ?? [],
      estimatedReadyAt: new Date(Date.now() + 300000).toISOString(),
      downloadUrl: null,
    },
    { requestId }
  );
}
