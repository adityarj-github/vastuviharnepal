import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      totalBlogs,
      publishedBlogs,
      totalGalleryFolders,
      totalGalleryImages,
      totalUsers,
      totalCookieConsents,
      recentLeads,
      recentApplications,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "CONTACTED" } }),
      prisma.lead.count({ where: { status: "CONVERTED" } }),
      prisma.jobOpening.count(),
      prisma.jobOpening.count({ where: { isOpen: true } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: "NEW" } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.galleryFolder.count(),
      prisma.galleryImageItem.count(),
      prisma.user.count(),
      prisma.cookieConsent.count(),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobApplication.findMany({
        take: 6,
        include: {
          jobOpening: {
            select: { title: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Leads by source
    const modelLeadsCount = await prisma.lead.count({ where: { source: "Model Inquiry" } });
    const blogLeadsCount = await prisma.lead.count({ where: { source: "Blog Lead" } });
    const contactLeadsCount = await prisma.lead.count({ where: { source: "Contact Form" } });
    const otherLeadsCount = totalLeads - (modelLeadsCount + blogLeadsCount + contactLeadsCount);

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
        totalBlogs,
        publishedBlogs,
        totalGalleryFolders,
        totalGalleryImages,
        totalUsers,
        totalCookieConsents,
      },
      sources: {
        modelInquiry: modelLeadsCount,
        blogLead: blogLeadsCount,
        contactForm: contactLeadsCount,
        other: Math.max(otherLeadsCount, 0),
      },
      recentLeads,
      recentApplications,
      currentUser: user,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
