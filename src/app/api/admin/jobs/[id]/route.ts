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
    const body = await request.json();
    const { title, department, type, location, description, requirements, isOpen } = body;

    const dataToUpdate: Record<string, unknown> = {};

    if (title !== undefined) dataToUpdate.title = title.trim();
    if (department !== undefined) dataToUpdate.department = department.trim();
    if (type !== undefined) dataToUpdate.type = type;
    if (location !== undefined) dataToUpdate.location = location;
    if (description !== undefined) dataToUpdate.description = description.trim();
    if (isOpen !== undefined) dataToUpdate.isOpen = Boolean(isOpen);

    if (requirements !== undefined) {
      if (Array.isArray(requirements)) {
        dataToUpdate.requirements = JSON.stringify(requirements);
      } else if (typeof requirements === "string") {
        dataToUpdate.requirements = JSON.stringify(
          requirements.split("\n").map((r) => r.trim()).filter(Boolean)
        );
      }
    }

    const job = await prisma.jobOpening.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.jobOpening.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
