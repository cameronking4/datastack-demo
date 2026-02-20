import { NextRequest } from "next/server";
import { created, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/templates/{templateId}/instantiate:
 *   post:
 *     summary: Instantiate template
 *     description: Create a stack or pipeline from a template with variable substitution
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Created
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
