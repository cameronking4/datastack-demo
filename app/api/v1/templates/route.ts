import { NextRequest } from "next/server";
import {
  listResponse,
  parsePagePagination,
  getRequestId,
} from "@/lib/api/response";

/**
 * GET /api/v1/templates
 * List available stack and pipeline templates for quick-start.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, pageSize } = parsePagePagination(searchParams, { pageSize: 25 });
  const requestId = getRequestId(request);
  const category = searchParams.get("category");

  const templates = [
    {
      id: "tmpl-etl-bronze-silver",
      name: "Bronze to Silver ETL",
      description: "Delta Lake bronze/silver pipeline with S3 source",
      category: "pipeline",
      resourceCount: 4,
      popularity: 892,
      createdAt: "2024-03-15T10:00:00Z",
    },
    {
      id: "tmpl-ml-feature-store",
      name: "ML Feature Store",
      description: "Feature store with offline/online tables",
      category: "stack",
      resourceCount: 6,
      popularity: 445,
      createdAt: "2024-04-01T14:00:00Z",
    },
    {
      id: "tmpl-dbt-core",
      name: "dbt Core Pipeline",
      description: "dbt transformations with Delta tables",
      category: "pipeline",
      resourceCount: 3,
      popularity: 1203,
      createdAt: "2024-02-20T09:00:00Z",
    },
    {
      id: "tmpl-realtime-kafka",
      name: "Kafka Real-time Ingestion",
      description: "Structured streaming from Kafka to Delta",
      category: "stack",
      resourceCount: 5,
      popularity: 678,
      createdAt: "2024-05-10T11:00:00Z",
    },
  ];

  const filtered = category
    ? templates.filter((t) => t.category === category)
    : templates;
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return listResponse("templates", paged, totalCount, {
    page,
    pageSize,
    requestId,
  });
}
