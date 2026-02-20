import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/api/response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const { clusterId } = await params;
  const requestId = getRequestId(request);
  const body = (await request.json()) as { targetRuntimeVersion?: string; scheduleAt?: string };

  const targetVersion = body.targetRuntimeVersion ?? "15.2.x-scala2.12";

  return NextResponse.json(
    {
      clusterId,
      upgradeId: "upg-" + Date.now(),
      currentRuntimeVersion: "14.3.x-scala2.12",
      targetRuntimeVersion: targetVersion,
      status: "UPGRADE_SCHEDULED",
      scheduleAt: body.scheduleAt ?? new Date(Date.now() + 86400000).toISOString(),
      message: "Runtime upgrade has been scheduled. The cluster will restart at the specified time.",
      requestId,
    },
    { status: 202, headers: { "x-request-id": requestId } }
  );
}
