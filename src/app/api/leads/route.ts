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

    const cleanFullName = String(fullName).trim().slice(0, 120);
    const cleanPhone = String(phone).trim().slice(0, 35);
    const cleanEmail = email ? String(email).trim().toLowerCase().slice(0, 120) : null;
    const cleanSource = source ? String(source).trim().slice(0, 80) : "General";
    const cleanResidence = residenceName ? String(residenceName).trim().slice(0, 120) : null;
    const cleanBudget = budget ? String(budget).trim().slice(0, 80) : null;
    const cleanPurpose = purpose ? String(purpose).trim().slice(0, 80) : null;
    const cleanLocation = locationPref ? String(locationPref).trim().slice(0, 120) : null;
    const cleanInterest = interestType ? String(interestType).trim().slice(0, 80) : null;
    const cleanBlogSlug = blogSlug ? String(blogSlug).trim().slice(0, 120) : null;
    const cleanMessage = message ? String(message).trim().slice(0, 2500) : null;

    if (cleanFullName.length < 2 || cleanPhone.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid name and phone number." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        source: cleanSource,
        residenceName: cleanResidence,
        budget: cleanBudget,
        purpose: cleanPurpose,
        locationPref: cleanLocation,
        interestType: cleanInterest,
        blogSlug: cleanBlogSlug,
        message: cleanMessage,
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
