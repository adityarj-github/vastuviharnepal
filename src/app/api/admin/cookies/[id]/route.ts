import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ROOT") {
    return NextResponse.json({ error: "Forbidden: Root Admin only" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.cookieConsent.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Consent record deleted" });
  } catch (error) {
    console.error("Delete cookie consent error:", error);
    return NextResponse.json({ error: "Failed to delete consent record" }, { status: 500 });
  }
}
