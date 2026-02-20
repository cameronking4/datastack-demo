import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const body = (await request.json()) as { jobIds: string[]; waitForCompletion?: boolean };

  const jobIds = body.jobIds ?? [];
  const runs = jobIds.map((id, i) => ({
    jobId: id,
    runId: "run-batch-" + Date.now() + "-" + i,
    status: "RUNNING",
    triggeredAt: new Date().toISOString(),
  }));

  return NextResponse.json(
    {
      batchId: "batch-" + Date.now(),
      runs,
      waitForCompletion: body.waitForCompletion ?? false,
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}
