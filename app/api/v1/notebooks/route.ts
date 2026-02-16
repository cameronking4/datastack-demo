import { NextRequest, NextResponse } from "next/server";
import { isPreviewEnabled } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/notebooks:
 *   get:
 *     summary: List notebooks
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Create or overwrite notebook
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * GET /api/v1/notebooks
 * List notebooks with path prefix filter
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10)));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));

  return NextResponse.json({
    notebooks: [
      {
        path: "/Workspace/ETL/daily_pipeline",
        language: "PYTHON",
        modifiedAt: "2024-03-09T18:00:00Z",
      },
      {
        path: "/Workspace/Reports/weekly",
        language: "PYTHON",
        modifiedAt: "2024-03-08T12:00:00Z",
      },
      {
        path: "/Workspace/Ad-hoc/explore",
        language: "SQL",
        modifiedAt: "2024-03-10T09:00:00Z",
      },
    ],
    totalCount: 3,
  });
}

/**
 * PUT /api/v1/notebooks
 * Create or overwrite notebook
 */
export async function PUT(request: NextRequest) {
  const preview = isPreviewEnabled(request);
  const body = (await request.json()) as {
    path: string;
    language: string;
    content?: string;
    overwrite?: boolean;
    format?: string;
    metadata?: Record<string, string>;
  };

  const response: Record<string, unknown> = {
    path: body.path,
    language: body.language as "PYTHON" | "SQL" | "SCALA" | "R",
    format: "SOURCE",
    content: body.content ?? "",
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  if (preview) {
    response.overwrite = body.overwrite ?? false;
    response.format = body.format ?? "SOURCE";
    response.metadata = body.metadata ?? {};
  }

  return NextResponse.json(response);
}
