import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessLeads } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessLeads(user.role)) {
    return NextResponse.json({ error: "Forbidden: sales team or root admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const source = searchParams.get("source") || "";
    const status = searchParams.get("status") || "";

    const whereClause: Record<string, unknown> = {};

    if (source && source !== "ALL") {
      whereClause.source = source;
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { fullName: { contains: q } },
        { phone: { contains: q } },
        { email: { contains: q } },
        { residenceName: { contains: q } },
        { purpose: { contains: q } },
        { locationPref: { contains: q } },
        { message: { contains: q } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Overview Stats
    const totalCount = await prisma.lead.count();
    const newCount = await prisma.lead.count({ where: { status: "NEW" } });
    const contactedCount = await prisma.lead.count({ where: { status: "CONTACTED" } });
    const inProgressCount = await prisma.lead.count({ where: { status: "IN_PROGRESS" } });
    const convertedCount = await prisma.lead.count({ where: { status: "CONVERTED" } });

    return NextResponse.json({
      leads,
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        inProgress: inProgressCount,
        converted: convertedCount,
      },
    });
  } catch (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
