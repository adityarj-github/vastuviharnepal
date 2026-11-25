import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ROOT and SALES can review cookie consent compliance records
  if (user.role !== "ROOT" && user.role !== "SALES") {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "ALL";

    const whereClause: Record<string, unknown> = {};

    if (search.trim()) {
      whereClause.OR = [
        { clientId: { contains: search.trim() } },
        { ipHash: { contains: search.trim() } },
        { userAgent: { contains: search.trim() } },
      ];
    }

    if (filter === "ANALYTICS") whereClause.analytics = true;
    if (filter === "MARKETING") whereClause.marketing = true;
    if (filter === "PREFERENCES") whereClause.preferences = true;
    if (filter === "ESSENTIAL_ONLY") {
      whereClause.analytics = false;
      whereClause.marketing = false;
      whereClause.preferences = false;
    }

    const [total, analyticsCount, marketingCount, preferencesCount, consents] = await Promise.all([
      prisma.cookieConsent.count(),
      prisma.cookieConsent.count({ where: { analytics: true } }),
      prisma.cookieConsent.count({ where: { marketing: true } }),
      prisma.cookieConsent.count({ where: { preferences: true } }),
      prisma.cookieConsent.findMany({
        where: whereClause,
        orderBy: { updatedAt: "desc" },
        take: 100,
      }),
    ]);

    const essentialOnlyCount = await prisma.cookieConsent.count({
      where: {
        analytics: false,
        marketing: false,
        preferences: false,
      },
    });

    return NextResponse.json({
      stats: {
        total,
        analyticsCount,
        marketingCount,
        preferencesCount,
        essentialOnlyCount,
      },
      consents,
    });
  } catch (error) {
    console.error("Admin cookie consents error:", error);
    return NextResponse.json({ error: "Failed to load cookie consents" }, { status: 500 });
  }
}
