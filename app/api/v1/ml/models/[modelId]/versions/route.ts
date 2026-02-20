import { NextRequest } from "next/server";
import {
  listResponse,
  parseOffsetPagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * GET /api/v1/ml/models/:modelId/versions
 * List all registered versions of an ML model.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  const { modelId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = parseOffsetPagination(searchParams, { limit: 25 });
  const requestId = getRequestId(request);

  const versions = [
    {
      version: "2.0.0",
      modelId,
      stage: "Production",
      runId: "run-ml-002",
      createdAt: "2024-06-01T12:00:00Z",
      createdBy: "ada@datastack.dev",
      description: "Improved recall on edge cases",
    },
    {
      version: "1.0.0",
      modelId,
      stage: "Archived",
      runId: "run-ml-001",
      createdAt: "2024-05-15T10:00:00Z",
      createdBy: "ada@datastack.dev",
      description: "Initial production release",
    },
  ];

  const totalCount = versions.length;
  const paged = versions.slice(offset, offset + limit);

  return listResponse("versions", paged, totalCount, {
    limit,
    offset,
    requestId,
  });
}
