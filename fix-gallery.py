from pathlib import Path
from zipfile import ZipFile

out = Path("gallery-wall-fix")
hero = "src/components/gallery-page/GalleryHero3D.tsx"
shared = "src/components/gallery-page/galleryWallFrames.ts"
public = "src/app/gallery/page.tsx"
admin = "src/app/admin/gallery/page.tsx"
schema = "prisma/schema.prisma"
pdf = "src/components/admin/PdfPreview.tsx"


def replace_once(source, old, new):
    if source.count(old) != 1:
        raise SystemExit(f"Unexpected archive source for {old!r}. Use the original Archive.zip.")
    return source.replace(old, new, 1)


with ZipFile("Archive.zip") as archive:
    files = {
        path: archive.read(path).decode("utf-8")
        for path in (hero, public, admin, schema, pdf)
    }

start = files[hero].index("// ─── TYPES")
end = files[hero].index("// ─── PROCEDURAL MODERN WALL TEXTURE", start)
files[shared] = 'import type { GalleryFolder } from "@/data/gallery";\n\n' + files[hero][start:end]
files[hero] = files[hero][:start] + '''import {
  DEFAULT_GALLERY_PHOTOS,
  WALL_SLOTS,
  type GalleryPhotoItem,
  type WallSlotConfig,
} from "./galleryWallFrames";

export { DEFAULT_GALLERY_PHOTOS, WALL_SLOTS } from "./galleryWallFrames";
export type { GalleryPhotoItem, WallSlotConfig } from "./galleryWallFrames";

''' + files[hero][end:]

files[hero] = replace_once(
    files[hero],
    "                  src={selectedPhoto.url}\n",
    '                  src={selectedPhoto.url}\n'
    '                  unoptimized={selectedPhoto.url.startsWith("/api/files/")}\n',
)

link = '              <Link href="/gallery" target="_blank" className={commonStyles.btnSecondary}>'
files[admin] = replace_once(files[admin], link, '''              <Link href="/admin/gallery/walls" className={commonStyles.btnSky}>
                Edit 3D Wall Images
              </Link>
''' + link)

files[schema] = replace_once(files[schema], "model CookieConsent {", """model GalleryWallImage {
  slotId String @id
  src    String
  alt    String
}

model CookieConsent {""")

files[pdf] = replace_once(
    files[pdf],
    "        await page.render({ canvasContext, viewport }).promise;",
    "        const renderParameters = { canvas: null, canvasContext, viewport };\n"
    "        await page.render(renderParameters).promise;",
)

files[shared] += r'''export type WallImage = { slotId: string; src: string; alt: string };

export function resolveGalleryWallFrames(folders: GalleryFolder[], overrides: WallImage[]) {
  const items: GalleryPhotoItem[] = folders.flatMap((folder) => [
    {
      id: `cover-${folder.slug}`,
      url: folder.coverImage,
      title: folder.title,
      category: folder.category,
    },
    ...folder.images.map((image, index) => ({
      id: `${folder.slug}-${index}`,
      url: image.src,
      title: image.caption || image.alt || folder.title,
      category: folder.category,
    })),
  ]);
  const bySlot = new Map(overrides.map((image) => [image.slotId, image]));

  return WALL_SLOTS.map((slot, index) => {
    const fallback = items[index] ?? DEFAULT_GALLERY_PHOTOS[index];
    const override = bySlot.get(slot.id);
    const photo = override
      ? { ...fallback, id: slot.id, url: override.src, title: override.alt }
      : fallback;
    return { slotId: slot.id, wall: slot.wall, photo, fallback, custom: !!override };
  });
}
'''

files[public] = r'''import type { Metadata } from "next";
import { GalleryFoldersGrid } from "@/components/gallery-page";
import { GalleryHero3DWrapper } from "@/components/gallery-page/GalleryHero3DWrapper";
import { resolveGalleryWallFrames } from "@/components/gallery-page/galleryWallFrames";
import { getLiveGalleryFolders } from "@/lib/data-fetchers";
import { prisma } from "@/lib/prisma";

// Reads live content from the database (D1) on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo Gallery & 3D Virtual Archives | Vastu Vihar Nepal",
  description:
    "Explore our interactive 3D virtual exhibition hall and photo collections of community celebrations, property expos, sports championships, and media coverage across Vastu Vihar Nepal townships.",
};

export default async function GalleryPage() {
  const [folders, wallImages] = await Promise.all([
    getLiveGalleryFolders(),
    prisma.galleryWallImage.findMany().catch((error: unknown) => {
      console.error("Could not read gallery wall images:", error);
      return [];
    }),
  ]);
  const heroItems = resolveGalleryWallFrames(folders, wallImages).map(({ photo }) => photo);

  return (
    <main>
      <GalleryHero3DWrapper items={heroItems} />
      <GalleryFoldersGrid folders={folders} />
    </main>
  );
}
'''

files["migrations/0004_gallery_wall_images.sql"] = r'''CREATE TABLE IF NOT EXISTS "GalleryWallImage" (
    "slotId" TEXT NOT NULL PRIMARY KEY,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL
);
'''

files["src/app/admin/gallery/walls/page.tsx"] = r'''import { revalidatePath } from "next/cache";
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

export default async function AdminGalleryWallsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/admin/login");
  if (!canAccessMedia(user.role)) notFound();

  const [folders, overrides] = await Promise.all([
    getLiveGalleryFolders(),
    prisma.galleryWallImage.findMany(),
  ]);

  return (
    <div>
      <div className={commonStyles.cardHeader}>
        <h1 className={commonStyles.cardTitle}>3D Wall Images</h1>
        <Link href="/admin/gallery" className={commonStyles.btnSecondary}>Back to Gallery</Link>
      </div>
      <GalleryWallEditor frames={resolveGalleryWallFrames(folders, overrides)} saveImageAction={saveWallImage} />
    </div>
  );
}
'''

files["src/app/admin/gallery/walls/GalleryWallEditor.tsx"] = r'''"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import styles from "@/components/admin/AdminCommon.module.css";
import galleryStyles from "@/components/admin/AdminGallery.module.css";
import type { resolveGalleryWallFrames } from "@/components/gallery-page/galleryWallFrames";
import { compressImageToWebP } from "@/lib/clientImageCompress";

type Frame = ReturnType<typeof resolveGalleryWallFrames>[number];
type Edit = { src: string; alt: string } | null;
type SaveImage = (slotId: string, image: Edit) => Promise<{ error: string | null }>;

const walls = [
  ["center", "Center wall"],
  ["left", "Left wall"],
  ["right", "Right wall"],
] as const;

function FrameEditor({ frame, saveImage }: { frame: Frame; saveImage: SaveImage }) {
  const [saved, setSaved] = useState({ src: frame.photo.url, alt: frame.photo.title });
  const [draft, setDraft] = useState(saved);
  const [custom, setCustom] = useState(frame.custom);
  const [busy, setBusy] = useState<"upload" | "save" | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy("upload");
    setMessage(null);
    try {
      if (!/\.(?:jpe?g|png|webp|gif)$/i.test(file.name)) {
        throw new Error("Choose a JPG, PNG, WebP, or GIF image.");
      }
      const data = new FormData();
      data.set("file", /\.gif$/i.test(file.name) ? file : await compressImageToWebP(file));
      data.set("folder", "gallery");
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        throw new Error(result.error || "Could not upload the image.");
      }
      setDraft({ src: result.url, alt: "" });
      setMessage({ text: "Image uploaded. Add a description and save the frame." });
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : "Could not upload the image." });
    } finally {
      setBusy(null);
    }
  }

  async function save(image: Edit) {
    setBusy("save");
    setMessage(null);
    try {
      const result = await saveImage(frame.slotId, image);
      if (result.error) {
        setMessage({ error: true, text: result.error });
        return;
      }
      const next = image ?? { src: frame.fallback.url, alt: frame.fallback.title };
      setSaved(next);
      setDraft(next);
      setCustom(image !== null);
      setMessage({ text: image ? "Image saved." : "Automatic image restored." });
    } catch {
      setMessage({ error: true, text: "Could not save the image. Try again." });
    } finally {
      setBusy(null);
    }
  }

  const label = frame.slotId.split("-").slice(1).join(" ");
  return (
    <form
      className={galleryStyles.folderCard}
      onSubmit={(event) => {
        event.preventDefault();
        void save({ src: draft.src.trim(), alt: draft.alt.trim() });
      }}
    >
      <div className={galleryStyles.folderThumbWrapper}>
        <Image
          src={saved.src}
          alt={saved.alt}
          className={galleryStyles.folderThumb}
          sizes="(max-width: 768px) 100vw, 340px"
          fill
          unoptimized
        />
      </div>
      <fieldset disabled={busy !== null} className={galleryStyles.folderContent} style={{ border: 0, minWidth: 0 }}>
        <h3 className={galleryStyles.folderTitle} style={{ textTransform: "capitalize" }}>
          Frame {label}
        </h3>
        <label className={styles.formGroup}>
          <span className={styles.label}>Image path</span>
          <input
            className={styles.input}
            value={draft.src}
            onChange={(event) => setDraft({ ...draft, src: event.target.value })}
            maxLength={2048}
            required
          />
        </label>
        <label className={styles.formGroup}>
          <span className={styles.label}>Upload image</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={upload} />
        </label>
        <label className={styles.formGroup}>
          <span className={styles.label}>Image description</span>
          <input
            className={styles.input}
            value={draft.alt}
            onChange={(event) => setDraft({ ...draft, alt: event.target.value })}
            maxLength={200}
            required
          />
        </label>
        <div className={galleryStyles.folderActions}>
          <button type="submit" className={styles.btnPrimary}>
            {busy === "save" ? "Saving…" : "Save image"}
          </button>
          {custom && (
            <button type="button" className={styles.btnSecondary} onClick={() => void save(null)}>
              Use automatic image
            </button>
          )}
        </div>
        {busy === "upload" && <p role="status">Uploading image…</p>}
        {message && <p role={message.error ? "alert" : "status"}>{message.text}</p>}
      </fieldset>
    </form>
  );
}

export default function GalleryWallEditor({ frames, saveImageAction }: { frames: Frame[]; saveImageAction: SaveImage }) {
  return walls.map(([wall, label]) => (
    <section key={wall} className={styles.card} style={{ marginTop: "1rem" }}>
      <h2 className={styles.cardTitle}>{label}</h2>
      <div className={galleryStyles.foldersGrid}>
        {frames.filter((frame) => frame.wall === wall).map((frame) => (
          <FrameEditor key={frame.slotId} frame={frame} saveImage={saveImageAction} />
        ))}
      </div>
    </section>
  ));
}
'''

out.mkdir()
for path, content in files.items():
    target = out / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")

print(f"Wrote {len(files)} complete files to {out}/")
