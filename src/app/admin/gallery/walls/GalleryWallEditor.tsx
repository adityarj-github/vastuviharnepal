"use client";

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
