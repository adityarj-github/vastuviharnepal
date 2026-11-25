import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, hashPassword } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const currentUser = await getAuthenticatedUser();
  if (!currentUser || currentUser.role !== "ROOT") {
    return NextResponse.json({ error: "Forbidden: Root Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only ROOT can edit ROOT user
    if (targetUser.role === "ROOT" && currentUser.role !== "ROOT") {
      return NextResponse.json({ error: "Only the Root user can modify Root user details." }, { status: 403 });
    }

    const { email, password, name, role } = await request.json();

    const dataToUpdate: Record<string, unknown> = {};

    if (email && email.trim() !== targetUser.email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        return NextResponse.json({ error: "Email already in use." }, { status: 400 });
      }
      dataToUpdate.email = normalizedEmail;
    }

    if (name) dataToUpdate.name = name.trim();

    if (password && password.trim().length >= 6) {
      dataToUpdate.password = await hashPassword(password.trim());
    }

    if (role && currentUser.role === "ROOT") {
      dataToUpdate.role = role;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const currentUser = await getAuthenticatedUser();
  if (!currentUser || currentUser.role !== "ROOT") {
    return NextResponse.json({ error: "Only ROOT users can delete accounts." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ROOT") {
      return NextResponse.json({ error: "Cannot delete the ROOT user." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
