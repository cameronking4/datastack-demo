import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/users/:id
 * Get user by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id,
    fullName: "Ada Lovelace",
    email: "ada@datastack.dev",
    avatarUrl: "https://api.datastack.dev/avatars/ada.png",
    department: "Engineering",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T15:30:00Z",
    role: "admin",
    status: "active",
    lastLoginAt: "2024-06-10T08:00:00Z",
  });
}

/**
 * PATCH /api/v1/users/:id
 * Update user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id,
    fullName: "Ada Lovelace",
    email: "ada@datastack.dev",
    avatarUrl: "https://api.datastack.dev/avatars/ada.png",
    department: "Engineering",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
    role: "admin",
    status: "active",
    lastLoginAt: "2024-06-10T08:00:00Z",
  });
}

/**
 * DELETE /api/v1/users/:id
 * Delete user
 */
export async function DELETE() {
  return new NextResponse(null, { status: 204 });
}
