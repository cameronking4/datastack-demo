import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/users
 * List users with pagination and filters
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") ?? "20", 10)));

  return NextResponse.json({
    data: [
      {
        id: "u1",
        fullName: "Ada Lovelace",
        email: "ada@datastack.dev",
        avatarUrl: "https://api.datastack.dev/avatars/ada.png",
        department: "Engineering",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-01T15:30:00Z",
        role: "admin",
        status: "active",
        lastLoginAt: "2024-06-10T08:00:00Z",
      },
    ],
    pagination: {
      total: 1,
      page,
      perPage,
      hasMore: false,
    },
  });
}

/**
 * POST /api/v1/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { fullName: string; email: string; role: string };
  return NextResponse.json(
    {
      id: "u-new",
      fullName: body.fullName,
      email: body.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: body.role,
      status: "pending_verification",
    },
    { status: 201 }
  );
}
