import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/notebooks/export
 * Export notebook at path in requested format (SOURCE, HTML, JUPYTER)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") ?? "";
  const format = (searchParams.get("format") ?? "SOURCE") as "SOURCE" | "HTML" | "JUPYTER";

  return NextResponse.json({
    path,
    language: "PYTHON",
    format,
    content: "# Databricks notebook source\n# MAGIC %md\n# Sample",
    createdAt: "2024-02-01T10:00:00Z",
    modifiedAt: "2024-03-09T18:00:00Z",
  });
}
