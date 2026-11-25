import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      requirements: (() => {
        try {
          return JSON.parse(job.requirements);
        } catch {
          return job.requirements.split("\n").filter(Boolean);
        }
      })(),
    }));

    return NextResponse.json({ openings: formatted });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch job openings" }, { status: 500 });
  }
}
