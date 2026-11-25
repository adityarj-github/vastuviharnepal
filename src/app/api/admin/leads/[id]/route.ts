import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessLeads } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessLeads(user.role)) {
    return NextResponse.json({ error: "Forbidden: sales team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { status, notes } = await request.json();

    const dataToUpdate: Record<string, unknown> = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const updated = await prisma.lead.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Admin lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessLeads(user.role)) {
    return NextResponse.json({ error: "Forbidden: sales team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Admin lead delete error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
