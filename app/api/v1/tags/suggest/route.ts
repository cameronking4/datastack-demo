import { NextRequest } from "next/server";
import { ok, getRequestId } from "@/lib/api/response";

/**
 * GET /api/v1/tags/suggest
 * Suggest tag keys/values based on partial input (autocomplete).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = getRequestId(request);
  const q = searchParams.get("q") ?? "";

  const suggestions = [
    { key: "team", value: "platform", match: "team:platform" },
    { key: "team", value: "analytics", match: "team:analytics" },
    { key: "env", value: "production", match: "env:production" },
  ].filter((s) => s.match.toLowerCase().includes(q.toLowerCase()));

  return ok(
    {
      suggestions: suggestions.slice(0, 10),
    },
    { requestId }
  );
}
