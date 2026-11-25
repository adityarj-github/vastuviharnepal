import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessHR } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const status = searchParams.get("status");

    const whereClause: Record<string, unknown> = {};

    if (position && position !== "ALL") {
      whereClause.position = { contains: position };
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        jobOpening: {
          select: { title: true, department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Admin applications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
