"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import commonStyles from "@/components/admin/AdminCommon.module.css";
import galleryStyles from "@/components/admin/AdminGallery.module.css";

interface GalleryImage {
  id: string;
  folderId: string;
  src: string;
  alt: string;
  caption?: string | null;
  order: number;
}

interface GalleryFolder {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  order: number;
  images: GalleryImage[];
  _count?: {
    images: number;
  };
}

const DEFAULT_CATEGORIES = [
  "Architecture & Design",
  "Construction & Craftsmanship",
  "Life at Vastu Vihar",
  "Site & Environment",
  "Interior & Finishings",
  "Amenities & Clubhouse",
];

export default function AdminGalleryPage() {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Folder Modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<GalleryFolder | null>(null);
  const [folderTitle, setFolderTitle] = useState("");
  const [folderSlug, setFolderSlug] = useState("");
  const [folderCategory, setFolderCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [folderDescription, setFolderDescription] = useState("");
  const [folderCoverImage, setFolderCoverImage] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSavingFolder, setIsSavingFolder] = useState(false);

  // Photos upload state
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/gallery/folders");
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
        // Update selectedFolder if active
        if (selectedFolder) {
          const updated = (data.folders || []).find((f: GalleryFolder) => f.id === selectedFolder.id);
          if (updated) setSelectedFolder(updated);
        }
      }
    } catch (err) {
      console.error("Failed to load folders", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const openCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderTitle("");
    setFolderSlug("");
    setFolderCategory(DEFAULT_CATEGORIES[0]);
    setFolderDescription("");
    setFolderCoverImage("/gallery/architecture/hero.jpg");
    setIsFolderModalOpen(true);
  };

  const openEditFolderModal = (folder: GalleryFolder) => {
    setEditingFolder(folder);
    setFolderTitle(folder.title);
    setFolderSlug(folder.slug);
    setFolderCategory(folder.category);
    setFolderDescription(folder.description);
    setFolderCoverImage(folder.coverImage);
    setIsFolderModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFolderTitle(val);
    if (!editingFolder) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFolderSlug(generated);
    }
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "gallery");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Cover upload failed");
        return;
      }

      const data = await res.json();
      setFolderCoverImage(data.url);
    } catch (err) {
      console.error("Cover upload error:", err);
      alert("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderTitle || !folderCoverImage) {
      alert("Title and Cover image are required.");
      return;
    }

    try {
      setIsSavingFolder(true);
      const payload = {
        title: folderTitle,
        slug: folderSlug,
        category: folderCategory,
        description: folderDescription,
        coverImage: folderCoverImage,
      };

      let res;
      if (editingFolder) {
        res = await fetch(`/api/admin/gallery/folders/${editingFolder.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/gallery/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save folder");
        return;
      }

      setIsFolderModalOpen(false);
      await loadFolders();
    } catch (err) {
      console.error("Save folder error:", err);
      alert("An error occurred while saving the folder.");
    } finally {
      setIsSavingFolder(false);
    }
  };

  const handleDeleteFolder = async (folder: GalleryFolder) => {
    if (!confirm(`Are you sure you want to delete the folder "${folder.title}" and all its photos? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/folders/${folder.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete folder");
        return;
      }

      if (selectedFolder?.id === folder.id) {
        setSelectedFolder(null);
      }
      await loadFolders();
    } catch (err) {
      console.error("Delete folder error:", err);
      alert("Failed to delete folder");
    }
  };

  const handlePhotosUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedFolder) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const uploadedImages: { src: string; alt: string; caption?: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "gallery");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImages.push({
            src: uploadData.url,
            alt: `${selectedFolder.title} - ${file.name.replace(/\.[^/.]+$/, "")}`,
            caption: photoCaption || undefined,
          });
        }
      }

      if (uploadedImages.length > 0) {
        const addRes = await fetch("/api/admin/gallery/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderId: selectedFolder.id,
            images: uploadedImages,
          }),
        });

        if (addRes.ok) {
          setPhotoCaption("");
          await loadFolders();
        } else {
          alert("Failed to link uploaded images to folder.");
        }
      }
    } catch (err) {
      console.error("Bulk photo upload error:", err);
      alert("Error uploading photos");
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;

    try {
      const res = await fetch(`/api/admin/gallery/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete photo");
        return;
      }

      await loadFolders();
    } catch (err) {
      console.error("Delete image error:", err);
      alert("Failed to delete image");
    }
  };

  const filteredFolders = folders.filter((f) => {
    if (activeCategory === "all") return true;
    return f.category === activeCategory;
  });

  return (
    <div>
      {/* Top Banner / Actions */}
      <div className={commonStyles.cardHeader}>
        <div>
          <h1 className={commonStyles.cardTitle}>
            {selectedFolder ? `${selectedFolder.title} (${selectedFolder.images.length} Photos)` : "Gallery & Media Folders"}
          </h1>
          <p className={commonStyles.cardSubtitle}>
            {selectedFolder
              ? `Manage and upload high-resolution photography for ${selectedFolder.title}`
              : "Organize architecture, construction, lifestyle, and site galleries controlled directly from backend"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {selectedFolder ? (
            <>
              <button
                type="button"
                className={commonStyles.btnSecondary}
                onClick={() => setSelectedFolder(null)}
              >
                ← Back to Folders
              </button>
              <button
                type="button"
                className={commonStyles.btnSky}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhotos}
              >
                {isUploadingPhotos ? "Uploading Photos..." : "+ Upload Photos to Folder"}
              </button>
            </>
          ) : (
            <>
              <Link href="/gallery" target="_blank" className={commonStyles.btnSecondary}>
                View Public Gallery ↗
              </Link>
              <button type="button" className={commonStyles.btnPrimary} onClick={openCreateFolderModal}>
                + Create New Folder
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIEW 1: SINGLE FOLDER MEDIA MANAGER */}
      {selectedFolder ? (
        <div className={commonStyles.card} style={{ marginTop: "1rem" }}>
          <div className={galleryStyles.detailHeader}>
            <div>
              <span className={galleryStyles.badgeCategory}>{selectedFolder.category}</span>
              <p style={{ fontSize: "0.88rem", color: "rgba(1,28,91,0.7)", marginTop: "0.5rem" }}>
                {selectedFolder.description || "No description provided."}
              </p>
            </div>
            <div>
              <button
                type="button"
                className={commonStyles.btnSecondary}
                onClick={() => openEditFolderModal(selectedFolder)}
              >
                Edit Folder Info
              </button>
            </div>
          </div>

          {/* Hidden File Input for Bulk Upload */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotosUpload}
          />

          {/* Upload Drop Area */}
          <div
            className={galleryStyles.uploadDropzone}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className={galleryStyles.dropzoneIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className={galleryStyles.dropzoneText}>
              {isUploadingPhotos ? "Uploading selected files..." : "Click to select or drag & drop photos here"}
            </div>
            <div className={galleryStyles.dropzoneHint}>
              PNG, JPG, WebP, AVIF supported (up to 10MB per image). You can select multiple images at once.
            </div>
          </div>

          {/* Photos Grid */}
          {selectedFolder.images.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(1,28,91,0.5)" }}>
              <p style={{ fontSize: "1rem", fontWeight: 600 }}>No photos uploaded to this folder yet.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                Click the dropzone above to add photography to this collection.
              </p>
            </div>
          ) : (
            <div className={galleryStyles.imagesGrid}>
              {selectedFolder.images.map((img) => (
                <div key={img.id} className={galleryStyles.imageCard}>
                  <Image
                    src={img.src}
                    alt={img.alt || selectedFolder.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={galleryStyles.imageItem}
                  />
                  <div className={galleryStyles.imageOverlay}>
                    <div className={galleryStyles.imageCaption}>
                      {img.caption || img.alt || "Gallery Photo"}
                    </div>
                    <div className={galleryStyles.imageActions}>
                      <button
                        type="button"
                        className={galleryStyles.imgActionBtn}
                        onClick={() => {
                          navigator.clipboard.writeText(img.src);
                          alert("Image path copied to clipboard!");
                        }}
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        className={`${galleryStyles.imgActionBtn} ${galleryStyles.imgDeleteBtn}`}
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: ALL FOLDERS VIEW */
        <>
          {/* Category Filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "1rem 0" }}>
            <button
              type="button"
              className={activeCategory === "all" ? commonStyles.btnPrimary : commonStyles.btnSecondary}
              style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", borderRadius: "20px" }}
              onClick={() => setActiveCategory("all")}
            >
              All Categories ({folders.length})
            </button>
            {DEFAULT_CATEGORIES.map((cat) => {
              const count = folders.filter((f) => f.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  type="button"
                  className={activeCategory === cat ? commonStyles.btnPrimary : commonStyles.btnSecondary}
                  style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", borderRadius: "20px" }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "rgba(1,28,91,0.5)" }}>
              Loading gallery folders...
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className={commonStyles.card} style={{ textAlign: "center", padding: "4rem" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#011c5b" }}>No gallery folders found</p>
              <p style={{ color: "rgba(1,28,91,0.6)", marginTop: "0.5rem" }}>
                Create your first gallery folder to showcase township photography, interiors, and construction milestones.
              </p>
              <button
                type="button"
                className={commonStyles.btnPrimary}
                style={{ marginTop: "1.25rem" }}
                onClick={openCreateFolderModal}
              >
                + Create Folder Now
              </button>
            </div>
          ) : (
            <div className={galleryStyles.foldersGrid}>
              {filteredFolders.map((folder) => {
                const imgCount = folder.images?.length ?? folder._count?.images ?? 0;
                return (
                  <div key={folder.id} className={galleryStyles.folderCard}>
                    <div className={galleryStyles.folderThumbWrapper}>
                      <Image
                        src={folder.coverImage}
                        alt={folder.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={galleryStyles.folderThumb}
                      />
                      <div className={galleryStyles.folderBadgeOverlay}>
                        <span className={galleryStyles.badgeCategory}>{folder.category}</span>
                        <span className={galleryStyles.badgeCount}>{imgCount} Photos</span>
                      </div>
                    </div>
                    <div className={galleryStyles.folderContent}>
                      <h3 className={galleryStyles.folderTitle}>{folder.title}</h3>
                      <div className={galleryStyles.folderSlug}>slug: /{folder.slug}</div>
                      <p className={galleryStyles.folderDesc}>
                        {folder.description || "Collection of photographs from Vastu Vihar Nepal."}
                      </p>
                      <div className={galleryStyles.folderActions}>
                        <button
                          type="button"
                          className={commonStyles.btnSky}
                          style={{ fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                          onClick={() => setSelectedFolder(folder)}
                        >
                          Manage Photos ({imgCount})
                        </button>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button
                            type="button"
                            className={commonStyles.btnSecondary}
                            style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
                            onClick={() => openEditFolderModal(folder)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={commonStyles.btnDanger}
                            style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
                            onClick={() => handleDeleteFolder(folder)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CREATE / EDIT FOLDER MODAL */}
      {isFolderModalOpen && (
        <div className={commonStyles.modalBackdrop} onClick={() => setIsFolderModalOpen(false)}>
          <div
            className={commonStyles.modal}
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={commonStyles.cardHeader}>
              <div>
                <h2 className={commonStyles.cardTitle}>
                  {editingFolder ? "Edit Gallery Folder" : "Create New Gallery Folder"}
                </h2>
                <p className={commonStyles.cardSubtitle}>
                  Set folder title, category, cover preview, and public slug
                </p>
              </div>
              <button
                type="button"
                className={commonStyles.btnSecondary}
                onClick={() => setIsFolderModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFolder}>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Folder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Villa Architecture"
                  value={folderTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={commonStyles.input}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="modern-villa-architecture"
                    value={folderSlug}
                    onChange={(e) => setFolderSlug(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Category *</label>
                  <select
                    value={folderCategory}
                    onChange={(e) => setFolderCategory(e.target.value)}
                    className={commonStyles.select}
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description of this photo collection..."
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  className={commonStyles.textarea}
                />
              </div>

              {/* Cover Image Upload / Selection */}
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Cover Image *</label>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    required
                    placeholder="/gallery/architecture/hero.jpg or uploaded path"
                    value={folderCoverImage}
                    onChange={(e) => setFolderCoverImage(e.target.value)}
                    className={commonStyles.input}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCoverUpload}
                  />
                  <button
                    type="button"
                    className={commonStyles.btnSky}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {uploadingCover ? "Uploading..." : "Upload Cover"}
                  </button>
                </div>

                {folderCoverImage && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "140px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid rgba(1,28,91,0.1)",
                    }}
                  >
                    <Image
                      src={folderCoverImage}
                      alt="Cover Preview"
                      fill
                      className={galleryStyles.folderThumb}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className={commonStyles.btnSecondary}
                  onClick={() => setIsFolderModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFolder}
                  className={commonStyles.btnPrimary}
                >
                  {isSavingFolder ? "Saving..." : editingFolder ? "Update Folder" : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
