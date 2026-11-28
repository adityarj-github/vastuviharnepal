import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getExtension, parseKey, storeFile, StorageNotConfiguredError } from "@/lib/storage";

const RESUME_URL_PREFIX = "/api/files/";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fullName = "";
    let email = "";
    let phone = "";
    let location = "";
    let position = "";
    let department = "";
    let experience = "";
    let portfolioUrl = "";
    let coverNote = "";
    let resumeUrl = "";
    let resumeFileName = "";
    let resumeNotStored = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      fullName = String(formData.get("fullName") || "").trim();
      email = String(formData.get("email") || "").trim();
      phone = String(formData.get("phone") || "").trim();
      location = String(formData.get("location") || "").trim();
      position = String(formData.get("position") || "").trim();
      department = String(formData.get("department") || "").trim();
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
        const ext = getExtension(file.name);
        const allowed = [".pdf", ".docx", ".doc", ".jpg", ".png", ".webp"];
        if (!allowed.includes(ext)) {
          return NextResponse.json(
            { error: `File type "${ext}" is not supported for resume. Allowed formats: PDF, DOCX, DOC, JPG, PNG.` },
            { status: 400 }
          );
        }

        resumeFileName = file.name.slice(0, 100);
        try {
          resumeUrl = await storeFile("resumes", file);
        } catch (err) {
          if (!(err instanceof StorageNotConfiguredError)) throw err;
          // Don't lose the application: save it and flag the missing resume for HR.
          console.error("Resume not stored:", err.message);
          resumeNotStored = true;
        }
      }
    } else {
      const json = await request.json();
      fullName = String(json.fullName || "").trim();
      email = String(json.email || "").trim();
      phone = String(json.phone || "").trim();
      location = String(json.location || "").trim();
      position = String(json.position || "").trim();
      department = String(json.department || "").trim();
      experience = String(json.experience || "").trim();
      portfolioUrl = String(json.portfolioUrl || "").trim();
      coverNote = String(json.coverNote || "").trim();
      resumeUrl = String(json.resumeUrl || "").trim();
      resumeFileName = String(json.resumeFileName || "").trim();

      // Only accept links to files already in our own resumes storage
      // (rejects external and javascript: URLs shown as links in the admin panel).
      if (
        resumeUrl &&
        !(
          resumeUrl.startsWith(RESUME_URL_PREFIX) &&
          parseKey(resumeUrl.slice(RESUME_URL_PREFIX.length)) === "resumes"
        )
      ) {
        resumeUrl = "";
        resumeFileName = "";
      }
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
    department = department.slice(0, 100);
    experience = experience.slice(0, 60);
    portfolioUrl = portfolioUrl.slice(0, 300);
    coverNote = coverNote.slice(0, 3000);

    if (resumeNotStored) {
      coverNote =
        `[System note: the candidate attached a resume ("${resumeFileName}") but it could not be ` +
        `stored because file storage is not configured. Please request it from the candidate.]` +
        (coverNote ? `\n\n${coverNote}` : "");
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

    const resolvedDepartment = department || matchingJob?.department || null;

    const application = await prisma.jobApplication.create({
      data: {
        fullName,
        email,
        phone,
        location,
        position,
        department: resolvedDepartment,
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
