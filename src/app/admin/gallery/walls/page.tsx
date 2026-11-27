import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import commonStyles from "@/components/admin/AdminCommon.module.css";
import { resolveGalleryWallFrames, WALL_SLOTS } from "@/components/gallery-page/galleryWallFrames";
import { canAccessMedia, getAuthenticatedUser } from "@/lib/auth";
import { getLiveGalleryFolders } from "@/lib/data-fetchers";
import { prisma } from "@/lib/prisma";
import GalleryWallEditor from "./GalleryWallEditor";

async function saveWallImage(slotId: string, image: { src: string; alt: string } | null) {
  "use server";

  const user = await getAuthenticatedUser();
  if (!user || !canAccessMedia(user.role)) return { error: "Media access is required." };
  if (!WALL_SLOTS.some((slot) => slot.id === slotId)) return { error: "Unknown wall frame." };

  try {
    if (image === null) {
      await prisma.galleryWallImage.deleteMany({ where: { slotId } });
    } else {
      const src = typeof image?.src === "string" ? image.src.trim() : "";
      const alt = typeof image?.alt === "string" ? image.alt.trim() : "";
      const isLocalPhoto = /^\/(?!\/)[\w./-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(src) &&
        !src.split("/").some((segment) => segment === "." || segment === "..");
      if (!isLocalPhoto || src.length > 2048 || !alt || alt.length > 200) {
        return { error: "Enter a site-relative image path and a description of up to 200 characters." };
      }

      await prisma.galleryWallImage.upsert({
        where: { slotId },
        create: { slotId, src, alt },
        update: { src, alt },
      });
    }
    revalidatePath("/gallery");
    return { error: null };
  } catch (error) {
    console.error("Could not save gallery wall image:", error);
    return { error: "Could not save the wall image. Try again." };
  }
}

async function loadWallImages() {
  try {
    const wallImages = prisma.galleryWallImage;
    if (!wallImages) {
      console.error("[admin/gallery/walls] Prisma client has no GalleryWallImage model.");
      return { status: "client" } as const;
    }
    return { status: "ready", images: await wallImages.findMany() } as const;
  } catch (error) {
    console.error("[admin/gallery/walls] Could not read gallery wall images:", error);
    const missingTable =
      (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") ||
      (error instanceof Error && /no such table:[^\n]*GalleryWallImage/i.test(error.message));

    return { status: missingTable ? "migration" : "unavailable" } as const;
  }
}

export default async function AdminGalleryWallsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/admin/login");
  if (!canAccessMedia(user.role)) notFound();

  const [folders, wallData] = await Promise.all([
    getLiveGalleryFolders(),
    loadWallImages(),
  ]);

  return (
    <div>
      <div className={commonStyles.cardHeader}>
        <h1 className={commonStyles.cardTitle}>3D Wall Images</h1>
        <Link href="/admin/gallery" className={commonStyles.btnSecondary}>Back to Gallery</Link>
      </div>
      {wallData.status === "ready" ? (
        <GalleryWallEditor
          frames={resolveGalleryWallFrames(folders, wallData.images)}
          saveImageAction={saveWallImage}
        />
      ) : (
        <div className={commonStyles.card} role="alert">
          <h2 className={commonStyles.cardTitle}>Wall images are unavailable</h2>
          <p className={commonStyles.cardSubtitle}>
            {wallData.status === "migration"
              ? "Apply the GalleryWallImage migration to the database used by this deployment, then reload."
              : wallData.status === "client"
                ? "Regenerate the Prisma client with the GalleryWallImage model and redeploy."
                : "The server could not load the wall images. Check the server logs and retry."}
          </p>
        </div>
      )}
    </div>
  );
}
