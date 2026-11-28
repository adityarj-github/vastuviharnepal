import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseStringList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  }
}

export async function GET() {
  try {
    const openings = await prisma.jobOpening.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = openings.map((job) => ({
      id: job.jobId || job.id,
      dbId: job.id,
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      description: job.description,
      jobDescription: parseStringList(job.jobDescription),
      requirements: parseStringList(job.requirements),
    }));

    return NextResponse.json({ openings: formatted });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch job openings" }, { status: 500 });
  }
}
