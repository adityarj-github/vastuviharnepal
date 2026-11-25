import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      source,
      residenceName,
      budget,
      purpose,
      locationPref,
      interestType,
      blogSlug,
      message,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Full Name and Phone Number are required." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim().toLowerCase() : null,
        source: source || "General",
        residenceName: residenceName || null,
        budget: budget || null,
        purpose: purpose || null,
        locationPref: locationPref || null,
        interestType: interestType || null,
        blogSlug: blogSlug || null,
        message: message ? String(message).trim() : null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, message: "Inquiry submitted successfully", leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to record inquiry. Please try again." },
      { status: 500 }
    );
  }
}
