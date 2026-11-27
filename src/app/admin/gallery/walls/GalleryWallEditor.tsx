"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import Image from "next/image";
import admin from "@/components/admin/AdminCommon.module.css";
import {
    WALL_SLOTS,
    type resolveGalleryWallFrames,
} from "@/components/gallery-page/galleryWallFrames";
import { compressImageToWebP } from "@/lib/clientImageCompress";
import styles from "./GalleryWallEditor.module.css";

type Frame = ReturnType<typeof resolveGalleryWallFrames>[number];
type Slot = (typeof WALL_SLOTS)[number];
type Photo = { src: string; alt: string };
type SaveImage = (
    slotId: string,
    image: Photo | null,
) => Promise<{ error: string | null }>;

const walls = [
    ["center", "Center wall"],
    ["left", "Left wall"],
    ["right", "Right wall"],
] as const;

function FrameCard({
    frame,
    slot,
    saveImage,
}: {
    frame: Frame;
    slot: Slot;
    saveImage: SaveImage;
}) {
    const [saved, setSaved] = useState({ src: frame.photo.url, alt: frame.photo.title });
    const [draft, setDraft] = useState(saved);
    const [custom, setCustom] = useState(frame.custom);
    const [busy, setBusy] = useState<"upload" | "save" | null>(null);
    const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);

    // WoodenPictureFrame subtracts 0.16 from each dimension for the visible photo.
    const [sceneWidth, sceneHeight] = slot.size;
    const width = Math.round((sceneWidth - 0.16) * 500);
    const height = Math.round((sceneHeight - 0.16) * 500);
    const orientation = width > height ? "Landscape" : width < height ? "Portrait" : "Square";

    const name = slot.isHero
        ? "Feature frame"
        : slot.id.slice(slot.wall.length + 1).replaceAll("-", " ");
    const heading = /^\d+$/.test(name) ? `Frame ${name}` : name;
    const guideId = `upload-guide-${slot.id}`;
    const preview = /^\/(?!\/)[\w./-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(draft.src)
        ? draft
        : saved;

    async function upload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setBusy("upload");
        setFeedback(null);

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
            setFeedback({ text: "Add a description and save the image." });
        } catch (error) {
            setFeedback({
                error: true,
                text: error instanceof Error ? error.message : "Could not upload the image.",
            });
        } finally {
            setBusy(null);
        }
    }

    async function save(image: Photo | null) {
        setBusy("save");
        setFeedback(null);

        try {
            const result = await saveImage(slot.id, image);
            if (result.error) {
                setFeedback({ error: true, text: result.error });
                return;
            }

            const next = image ?? { src: frame.fallback.url, alt: frame.fallback.title };
            setSaved(next);
            setDraft(next);
            setCustom(image !== null);
            setFeedback({ text: image ? "Image saved." : "Automatic image restored." });
        } catch {
            setFeedback({ error: true, text: "Could not save the image. Try again." });
        } finally {
            setBusy(null);
        }
    }

    return (
        <form
            className={styles.card}
            aria-label={heading}
            onSubmit={(event) => {
                event.preventDefault();
                void save({ src: draft.src.trim(), alt: draft.alt.trim() });
            }}
        >
            <div className={styles.stage}>
                <div
                    className={styles.preview}
                    style={{ "--frame-ratio": width / height } as CSSProperties}
                >
                    <Image src={preview.src} alt={preview.alt} fill unoptimized />
                </div>
            </div>

            <div className={styles.content}>
                <header className={styles.cardHeader}>
                    <h2 className={admin.cardTitle}>{heading}</h2>
                    <span className={styles.orientation}>{orientation}</span>
                </header>

                <p className={styles.guide} id={guideId}>
                    Recommended upload <strong>{width} × {height} px</strong>
                    <span>Width × height. Larger images with the same ratio also fit.</span>
                </p>

                <fieldset disabled={busy !== null} className={styles.fields}>
                    <label className={admin.label}>
                        Upload image
                        <input
                            className={admin.input}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.gif"
                            aria-describedby={guideId}
                            onChange={upload}
                        />
                    </label>

                    <label className={admin.label}>
                        Image path
                        <input
                            className={admin.input}
                            value={draft.src}
                            onChange={(event) => setDraft({ ...draft, src: event.target.value })}
                            maxLength={2048}
                            required
                        />
                    </label>

                    <label className={admin.label}>
                        Image description
                        <input
                            className={admin.input}
                            value={draft.alt}
                            onChange={(event) => setDraft({ ...draft, alt: event.target.value })}
                            maxLength={200}
                            required
                        />
                    </label>

                    <div className={styles.actions}>
                        <button className={admin.btnPrimary} type="submit">
                            {busy === "save" ? "Saving…" : "Save image"}
                        </button>
                        {custom && (
                            <button className={admin.btnSecondary} type="button" onClick={() => void save(null)}>
                                Use automatic image
                            </button>
                        )}
                    </div>
                </fieldset>

                {busy === "upload" && <p role="status">Uploading image…</p>}
                {feedback && (
                    <p role={feedback.error ? "alert" : "status"}>{feedback.text}</p>
                )}
            </div>
        </form>
    );
}

export default function GalleryWallEditor({
    frames,
    saveImageAction,
}: {
    frames: Frame[];
    saveImageAction: SaveImage;
}) {
    const [wall, setWall] = useState<Frame["wall"]>("center");
    const byId = new Map(frames.map((frame) => [frame.slotId, frame]));

    return (
        <div className={styles.layout}>
            <div className={styles.actions} role="group" aria-label="Gallery wall">
                {walls.map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        className={wall === id ? admin.btnPrimary : admin.btnSecondary}
                        aria-pressed={wall === id}
                        aria-controls={`wall-${id}`}
                        onClick={() => setWall(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {walls.map(([id, label]) => (
                <section
                    key={id}
                    id={`wall-${id}`}
                    aria-label={label}
                    className={styles.grid}
                    hidden={wall !== id}
                >
                    {WALL_SLOTS.filter((slot) => slot.wall === id).map((slot) => {
                        const frame = byId.get(slot.id);
                        return frame && (
                            <FrameCard key={slot.id} frame={frame} slot={slot} saveImage={saveImageAction} />
                        );
                    })}
                </section>
            ))}
        </div>
    );
}