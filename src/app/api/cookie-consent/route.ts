import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      essential = true,
      analytics = false,
      marketing = false,
      preferences = false,
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Capture anonymized IP hash and user agent for privacy audit logging
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip + "vastu-salt").digest("hex").slice(0, 16);
    const userAgent = request.headers.get("user-agent") || undefined;

    const consent = await prisma.cookieConsent.upsert({
      where: { clientId },
      update: {
        essential: Boolean(essential),
        analytics: Boolean(analytics),
        marketing: Boolean(marketing),
        preferences: Boolean(preferences),
        ipHash,
        userAgent,
      },
      create: {
        clientId,
        essential: Boolean(essential),
        analytics: Boolean(analytics),
        marketing: Boolean(marketing),
        preferences: Boolean(preferences),
        ipHash,
        userAgent,
      },
    });

    const response = NextResponse.json({ success: true, consent });

    // Also set HTTP cookie for fast server-side checks if needed
    response.cookies.set("vastu_cookie_consent", JSON.stringify({
      clientId: consent.clientId,
      essential: consent.essential,
      analytics: consent.analytics,
      marketing: consent.marketing,
      preferences: consent.preferences,
      updatedAt: consent.updatedAt,
    }), {
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: "lax",
      httpOnly: false, // accessible to client scripts to respect consent
    });

    return response;
  } catch (error) {
    console.error("Cookie consent save error:", error);
    return NextResponse.json({ error: "Failed to save cookie consent" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (clientId) {
      const consent = await prisma.cookieConsent.findUnique({ where: { clientId } });
      return NextResponse.json({ consent });
    }

    // Aggregated stats
    const total = await prisma.cookieConsent.count();
    const analyticsCount = await prisma.cookieConsent.count({ where: { analytics: true } });
    const marketingCount = await prisma.cookieConsent.count({ where: { marketing: true } });

    return NextResponse.json({
      totalConsents: total,
      analyticsConsents: analyticsCount,
      marketingConsents: marketingCount,
    });
  } catch (error) {
    console.error("Cookie consent get error:", error);
    return NextResponse.json({ error: "Failed to read cookie consent" }, { status: 500 });
  }
}
