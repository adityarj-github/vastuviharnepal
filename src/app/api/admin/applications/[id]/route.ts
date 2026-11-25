import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessHR } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { status, notes } = await request.json();

    const dataToUpdate: Record<string, unknown> = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const application = await prisma.jobApplication.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
