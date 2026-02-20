import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const requestId = getRequestId(_request);

  const dependencies = {
    upstream: [
      { type: "TABLE", catalog: "main", schema: "raw", name: "events", refreshMode: "INCREMENTAL" },
      { type: "JOB", jobId: "1001", name: "Daily ETL", trigger: "ON_SUCCESS" },
    ],
    downstream: [
      { type: "PIPELINE", pipelineId: "pipe-002", name: "Silver Transform" },
      { type: "TABLE", catalog: "main", schema: "bronze", name: "events" },
    ],
  };

  return NextResponse.json(
    { pipelineId, ...dependencies, requestId },
    { headers: { "x-request-id": requestId } }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    upstream?: { type: string; jobId?: string; catalog?: string; schema?: string; name?: string }[];
  };

  return NextResponse.json(
    {
      pipelineId,
      upstream: body.upstream ?? [],
      updatedAt: new Date().toISOString(),
      requestId,
    },
    { status: 200, headers: { "x-request-id": requestId } }
  );
}
