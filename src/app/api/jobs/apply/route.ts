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
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        // Enforce 10MB limit
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Resume file exceeds the 10MB limit." },
            { status: 400 }
          );
        }

        // Validate allowed extension
        const ext = path.extname(file.name).toLowerCase();
        const allowed = [".pdf", ".docx", ".doc", ".jpg", ".png", ".webp"];
        if (!allowed.includes(ext)) {
          return NextResponse.json(
            { error: `File type "${ext}" is not supported for resume. Allowed formats: PDF, DOCX, DOC, JPG, PNG.` },
            { status: 400 }
          );
        }

        resumeFileName = file.name.slice(0, 100);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
        await mkdir(uploadDir, { recursive: true });

        const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
        const safeName = `${Date.now()}-${safeBase}${ext}`;
        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, buffer);
        resumeUrl = `/uploads/resumes/${safeName}`;
      }
    } else {
      const json = await request.json();
      fullName = String(json.fullName || "").trim();
      email = String(json.email || "").trim();
      phone = String(json.phone || "").trim();
      location = String(json.location || "").trim();
      position = String(json.position || "").trim();
      experience = String(json.experience || "").trim();
      portfolioUrl = String(json.portfolioUrl || "").trim();
      coverNote = String(json.coverNote || "").trim();
      resumeUrl = String(json.resumeUrl || "").trim();
      resumeFileName = String(json.resumeFileName || "").trim();
    }

    if (!fullName || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Full Name, Email, Phone, and Position are required." },
        { status: 400 }
      );
    }

    // Bound input lengths
    fullName = fullName.slice(0, 100);
    email = email.slice(0, 120).toLowerCase();
    phone = phone.slice(0, 30);
    location = location.slice(0, 100);
    position = position.slice(0, 100);
    experience = experience.slice(0, 60);
    portfolioUrl = portfolioUrl.slice(0, 300);
    coverNote = coverNote.slice(0, 3000);

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
