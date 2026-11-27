import { prisma } from "@/lib/prisma";
import { galleryFolders, type GalleryFolder } from "@/data/gallery";
import { blogPosts, type BlogPost } from "@/data/blog";
import { careerPageData, type JobOpening } from "@/data/career";

/**
 * Fetch all gallery folders with images from the database with static fallback
 */
export async function getLiveGalleryFolders(): Promise<GalleryFolder[]> {
  try {
    const dbFolders = await prisma.galleryFolder.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    if (dbFolders && dbFolders.length > 0) {
      return dbFolders.map((f) => ({
        slug: f.slug,
        title: f.title,
        category: f.category,
        description: f.description,
        coverImage: f.coverImage,
        images: f.images.map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || undefined,
        })),
      }));
    }
  } catch (err) {
    console.error("Error fetching live gallery folders, falling back to static data:", err);
  }

  return galleryFolders;
}

/**
 * Fetch a single gallery folder by slug
 */
export async function getLiveGalleryFolder(slug: string): Promise<GalleryFolder | null> {
  try {
    const dbFolder = await prisma.galleryFolder.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (dbFolder) {
      return {
        slug: dbFolder.slug,
        title: dbFolder.title,
        category: dbFolder.category,
        description: dbFolder.description,
        coverImage: dbFolder.coverImage,
        images: dbFolder.images.map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || undefined,
        })),
      };
    }
  } catch (err) {
    console.error(`Error fetching live gallery folder "${slug}":`, err);
  }

  const staticFolder = galleryFolders.find((f) => f.slug === slug);
  return staticFolder || null;
}

/**
 * Fetch all published blog posts from the database with static fallback
 */
export async function getLiveBlogPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map((p) => {
        let tags: string[] = [];
        let keyTakeaways: string[] = [];
        let sections: any[] = [];

        try {
          tags = JSON.parse(p.tags);
        } catch {
          tags = p.tags ? p.tags.split(",").map((s) => s.trim()) : [];
        }

        try {
          keyTakeaways = JSON.parse(p.keyTakeaways);
        } catch {
          keyTakeaways = [];
        }

        try {
          sections = JSON.parse(p.sections);
        } catch {
          sections = [];
        }

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category as any,
          publishedDate: p.publishedDate,
          readTime: p.readTime,
          coverImage: p.coverImage,
          coverImageAlt: p.coverImageAlt,
          featured: p.featured,
          author: {
            name: p.authorName,
            role: p.authorRole,
            avatar: p.authorAvatar || undefined,
          },
          tags,
          keyTakeaways,
          sections,
        };
      });
    }
  } catch (err) {
    console.error("Error fetching live blog posts, falling back to static data:", err);
  }

  return blogPosts;
}

/**
 * Fetch a single blog post by slug
 */
export async function getLiveBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (dbPost && dbPost.isPublished) {
      let tags: string[] = [];
      let keyTakeaways: string[] = [];
      let sections: any[] = [];

      try {
        tags = JSON.parse(dbPost.tags);
      } catch {
        tags = dbPost.tags ? dbPost.tags.split(",").map((s) => s.trim()) : [];
      }

      try {
        keyTakeaways = JSON.parse(dbPost.keyTakeaways);
      } catch {
        keyTakeaways = [];
      }

      try {
        sections = JSON.parse(dbPost.sections);
      } catch {
        sections = [];
      }

      return {
        id: dbPost.id,
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        category: dbPost.category as any,
        publishedDate: dbPost.publishedDate,
        readTime: dbPost.readTime,
        coverImage: dbPost.coverImage,
        coverImageAlt: dbPost.coverImageAlt,
        featured: dbPost.featured,
        author: {
          name: dbPost.authorName,
          role: dbPost.authorRole,
          avatar: dbPost.authorAvatar || undefined,
        },
        tags,
        keyTakeaways,
        sections,
      };
    }
  } catch (err) {
    console.error(`Error fetching live blog post "${slug}":`, err);
  }

  const staticPost = blogPosts.find((p) => p.slug === slug);
  return staticPost || null;
}

/**
 * Fetch active job openings from the database with static fallback
 */
export async function getLiveJobOpenings(): Promise<JobOpening[]> {
  try {
    const dbJobs = await prisma.jobOpening.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "asc" },
    });

    if (dbJobs && dbJobs.length > 0) {
      return dbJobs.map((j) => {
        let requirements: string[] = [];
        try {
          requirements = JSON.parse(j.requirements);
        } catch {
          requirements = j.requirements ? j.requirements.split("\n").filter(Boolean) : [];
        }

        return {
          id: j.id,
          title: j.title,
          department: j.department,
          type: j.type,
          location: j.location,
          description: j.description,
          requirements,
        };
      });
    }
  } catch (err) {
    console.error("Error fetching live job openings, falling back to static data:", err);
  }

  return careerPageData.openings;
}
