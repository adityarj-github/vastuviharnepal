import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fullName = "";
    let email = "";
    let phone = "";
    let location = "";
    let position = "";
    let experience = "";
    let portfolioUrl = "";
    let coverNote = "";
    let resumeUrl = "";
    let resumeFileName = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      fullName = String(formData.get("fullName") || "").trim();
      email = String(formData.get("email") || "").trim();
      phone = String(formData.get("phone") || "").trim();
      location = String(formData.get("location") || "").trim();
      position = String(formData.get("position") || "").trim();
      experience = String(formData.get("experience") || "").trim();
      portfolioUrl = String(formData.get("portfolioUrl") || "").trim();
      coverNote = String(formData.get("coverNote") || "").trim();

      const file = formData.get("resume") as File | null;
      if (file && typeof file.arrayBuffer === "function") {
        resumeFileName = file.name;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
        await mkdir(uploadDir, { recursive: true });

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, buffer);
        resumeUrl = `/uploads/resumes/${safeName}`;
      }
    } else {
      const json = await request.json();
      fullName = json.fullName || "";
      email = json.email || "";
      phone = json.phone || "";
      location = json.location || "";
      position = json.position || "";
      experience = json.experience || "";
      portfolioUrl = json.portfolioUrl || "";
      coverNote = json.coverNote || "";
      resumeUrl = json.resumeUrl || "";
      resumeFileName = json.resumeFileName || "";
    }

    if (!fullName || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Full Name, Email, Phone, and Position are required." },
        { status: 400 }
      );
    }

    // Try linking with job opening if matching
    const matchingJob = await prisma.jobOpening.findFirst({
      where: {
        OR: [
          { title: { contains: position } },
          { jobId: position },
        ],
      },
    });

    const application = await prisma.jobApplication.create({
      data: {
        fullName,
        email,
        phone,
        location,
        position,
        jobOpeningId: matchingJob?.id || null,
        experience,
        portfolioUrl: portfolioUrl || null,
        coverNote: coverNote || null,
        resumeUrl: resumeUrl || null,
        resumeFileName: resumeFileName || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, message: "Application submitted successfully", applicationId: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
