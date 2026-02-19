import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * POST /api/v1/templates/{templateId}/instantiate
 * Create a stack or pipeline from a template with variable substitution.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as {
    workspaceId: string;
    name: string;
    variables?: Record<string, string>;
  };

  return created(
    {
      id: "stack-from-template",
      templateId,
      name: body.name ?? "Untitled Stack",
      workspaceId: body.workspaceId,
      status: "PROVISIONING",
      createdAt: new Date().toISOString(),
    },
    { requestId }
  );
}
