import type { GalleryFolder } from "@/data/gallery";

export type WallImage = { slotId: string; src: string; alt: string };

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