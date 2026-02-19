/**
 * Modern DataStack API response utilities.
 * Provides consistent response envelopes, pagination, and error handling
 * per API Overview conventions.
 */

import { NextResponse } from "next/server";

export const REQUEST_ID_HEADER = "x-request-id";
export const RATE_LIMIT_REMAINING = "x-ratelimit-remaining";
export const RATE_LIMIT_LIMIT = "x-ratelimit-limit";

/** Standard error code for client/server issues */
export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

/** Pagination params for page-based endpoints (clusters, stacks, connections, etc.) */
export interface PagePagination {
  page: number;
  pageSize: number;
}

/** Pagination params for offset-based endpoints (jobs, notebooks) */
export interface OffsetPagination {
  limit: number;
  offset: number;
}

/**
 * Parse page-based pagination from URL search params.
 * Supports both pageSize and perPage per API Overview.
 */
export function parsePagePagination(
  searchParams: URLSearchParams,
  defaults: { page?: number; pageSize?: number } = {}
): PagePagination {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(defaults.page ?? 1), 10));
  const pageSizeRaw =
    searchParams.get("pageSize") ?? searchParams.get("perPage") ?? String(defaults.pageSize ?? 25);
  const pageSize = Math.min(100, Math.max(1, parseInt(pageSizeRaw, 10)));
  return { page, pageSize };
}

/**
 * Parse offset-based pagination from URL search params.
 */
export function parseOffsetPagination(
  searchParams: URLSearchParams,
  defaults: { limit?: number; offset?: number } = {}
): OffsetPagination {
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(defaults.limit ?? 25), 10))
  );
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? String(defaults.offset ?? 0), 10));
  return { limit, offset };
}

/**
 * Standard list envelope for page-based endpoints.
 * Includes hasNextPage for cursor-less pagination UX.
 */
export interface ListEnvelope<T> {
  page?: number;
  pageSize?: number;
  totalCount: number;
  hasNextPage?: boolean;
  nextPage?: number;
  [key: string]: T[] | number | boolean | undefined;
}

/**
 * Build list response with typed envelope.
 * Resource key (e.g. "stacks", "clusters") must be the first additional property.
 */
export function listResponse<T>(
  resourceKey: string,
  items: T[],
  totalCount: number,
  options?: {
    page?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
    requestId?: string;
  }
): NextResponse<ListEnvelope<T> & Record<string, unknown>> {
  const envelope: ListEnvelope<T> & Record<string, unknown> = {
    [resourceKey]: items,
    totalCount,
  };
  if (options?.page !== undefined) envelope.page = options.page;
  if (options?.pageSize !== undefined) envelope.pageSize = options.pageSize;
  if (options?.limit !== undefined) envelope.limit = options.limit;
  if (options?.offset !== undefined) envelope.offset = options.offset;
  if (options?.page && options?.pageSize && totalCount > options.page * options.pageSize) {
    envelope.hasNextPage = true;
    envelope.nextPage = options.page + 1;
  } else if (
    options?.limit !== undefined &&
    options?.offset !== undefined &&
    totalCount > options.offset + items.length
  ) {
    envelope.hasMore = true;
  }
  const res = NextResponse.json(envelope);
  if (options?.requestId) res.headers.set(REQUEST_ID_HEADER, options.requestId);
  return res;
}

/**
 * Standard error response shape for 4xx/5xx.
 */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  };
}

function errorResponse(
  status: number,
  code: ApiErrorCode,
  message: string,
  options?: { details?: Record<string, unknown>; requestId?: string }
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    error: {
      code,
      message,
      ...(options?.details && { details: options.details }),
      ...(options?.requestId && { requestId: options.requestId }),
    },
  };
  const res = NextResponse.json(body, { status });
  if (options?.requestId) res.headers.set(REQUEST_ID_HEADER, options.requestId);
  return res;
}

export function badRequest(
  message: string,
  options?: { details?: Record<string, unknown>; requestId?: string }
) {
  return errorResponse(400, "BAD_REQUEST", message, options);
}

export function unauthorized(
  message = "Authentication required",
  options?: { requestId?: string }
) {
  return errorResponse(401, "UNAUTHORIZED", message, options);
}

export function forbidden(
  message = "Insufficient permissions",
  options?: { requestId?: string }
) {
  return errorResponse(403, "FORBIDDEN", message, options);
}

export function notFound(
  resource: string,
  id?: string,
  options?: { requestId?: string }
) {
  const message = id ? `${resource} ${id} not found` : `${resource} not found`;
  return errorResponse(404, "NOT_FOUND", message, options);
}

export function conflict(
  message: string,
  options?: { details?: Record<string, unknown>; requestId?: string }
) {
  return errorResponse(409, "CONFLICT", message, options);
}

export function rateLimited(
  message = "Too many requests",
  options?: { requestId?: string; retryAfter?: number }
) {
  const res = errorResponse(429, "RATE_LIMITED", message, options);
  if (options?.retryAfter) res.headers.set("Retry-After", String(options.retryAfter));
  return res;
}

export function internalError(
  message = "An unexpected error occurred",
  options?: { requestId?: string }
) {
  return errorResponse(500, "INTERNAL_ERROR", message, options);
}

/**
 * Success responses with optional request ID header.
 */
export function ok<T>(data: T, options?: { requestId?: string }): NextResponse<T> {
  const res = NextResponse.json(data);
  if (options?.requestId) res.headers.set(REQUEST_ID_HEADER, options.requestId);
  return res;
}

export function created<T>(data: T, options?: { requestId?: string }): NextResponse<T> {
  const res = NextResponse.json(data, { status: 201 });
  if (options?.requestId) res.headers.set(REQUEST_ID_HEADER, options.requestId);
  return res;
}

export function noContent(options?: { requestId?: string }): NextResponse {
  const res = new NextResponse(null, { status: 204 });
  if (options?.requestId) res.headers.set(REQUEST_ID_HEADER, options.requestId);
  return res;
}

/**
 * Read X-Request-ID from request or generate a short id for tracing.
 */
export function getRequestId(request: Request): string {
  const id = request.headers.get(REQUEST_ID_HEADER);
  if (id) return id;
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
