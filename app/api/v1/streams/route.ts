import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, featureRequiredResponse, FEATURE_STREAMING_HEADER } from "@/lib/api/preview";

/**
 * @swagger
 * /api/v1/streams:
 *   post:
 *     summary: Create stream
 *     description: Create a new streaming job
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               source:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   topic:
 *                     type: string
 *               sink:
 *                 type: object
 *               format:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(request, FEATURE_STREAMING_HEADER)) {
    return featureRequiredResponse(FEATURE_STREAMING_HEADER);
  }

  const body = (await request.json()) as {
    name?: string;
    source?: { type: string; topic: string };
    sink?: { type: string; table: string };
    format?: string;
  };

  return NextResponse.json(
    {
      streamId: "stream-" + Date.now(),
      name: body.name ?? "Untitled Stream",
      source: body.source ?? { type: "KAFKA", topic: "events" },
      sink: body.sink ?? { type: "DELTA", table: "catalog.schema.events_stream" },
      format: body.format ?? "JSON",
      status: "CREATED",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
