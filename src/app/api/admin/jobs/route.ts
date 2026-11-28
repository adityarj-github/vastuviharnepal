import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessHR } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  const jobs = await prisma.jobOpening.findMany({
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

function serializeStringList(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value.split("\n").map((r) => r.trim()).filter(Boolean));
  }
  return "[]";
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessHR(user.role)) {
    return NextResponse.json({ error: "Forbidden: HR team or root admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, department, type, location, description, jobDescription, requirements, isOpen } = body;

    if (!title || !department || !description) {
      return NextResponse.json(
        { error: "Title, Department, and Role Overview are required." },
        { status: 400 }
      );
    }

    const generatedJobId =
      body.jobId ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const jobDescString = serializeStringList(jobDescription);
    const reqString = serializeStringList(requirements);

    const job = await prisma.jobOpening.create({
      data: {
        jobId: generatedJobId,
        title: title.trim(),
        department: department.trim(),
        type: type || "Full-Time",
        location: location || "Birtamode / Birgunj, Nepal",
        description: description.trim(),
        jobDescription: jobDescString,
        requirements: reqString,
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
      },
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("Create job opening error:", error);
    return NextResponse.json({ error: "Failed to create job opening" }, { status: 500 });
  }
}
