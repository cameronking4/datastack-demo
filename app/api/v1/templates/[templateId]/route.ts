import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * @swagger
 * /api/v1/templates/{templateId}:
 *   get:
 *     summary: Get template
 *     description: Get template details and configuration
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  const requestId = getRequestId(request);

  return ok(
    {
      id: templateId,
      name: "Bronze to Silver ETL",
      description: "Delta Lake bronze/silver pipeline with S3 source",
      category: "pipeline",
      config: {
        layers: [
          { name: "Bronze", resourceType: "pipeline", resourceId: "{{pipeline_id}}" },
          { name: "Silver", resourceType: "pipeline", resourceId: "{{pipeline_id}}" },
        ],
        connections: ["s3-raw", "s3-curated"],
        variables: [
          { key: "catalog_name", required: true, default: "main" },
          { key: "schema_prefix", required: false, default: "analytics" },
        ],
      },
      resourceCount: 4,
      popularity: 892,
      createdAt: "2024-03-15T10:00:00Z",
      updatedAt: "2024-06-01T09:00:00Z",
    },
    { requestId }
  );
}
