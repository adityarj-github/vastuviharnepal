"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface BlogSectionItem {
  heading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  quote?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  isPublished: boolean;
  featured: boolean;
  authorName: string;
  authorRole: string;
  authorAvatar?: string | null;
  tags: string;
  keyTakeaways: string;
  sections: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "Engineering",
  "Township Living",
  "Architecture & Vastu",
  "Investment & Real Estate",
  "Sustainability",
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSectionIdx, setUploadingSectionIdx] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [authorName, setAuthorName] = useState("Vastu Vihar Editorial");
  const [authorRole, setAuthorRole] = useState("Senior Housing Advisor");
  const [readTime, setReadTime] = useState("5 min read");
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [takeawaysInput, setTakeawaysInput] = useState("");
  const [sections, setSections] = useState<BlogSectionItem[]>([]);

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load blogs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setCategory(CATEGORIES[0]);
    setExcerpt("");
    setCoverImage("");
    setCoverImageAlt("");
    setAuthorName("Vastu Vihar Editorial");
    setAuthorRole("Senior Housing Advisor");
    setReadTime("5 min read");
    setIsPublished(true);
    setFeatured(false);
    setTagsInput("Monolithic RCC, Township Living, Nepal Real Estate");
    setTakeawaysInput("100% monolithic concrete walls and slabs.\nEarthquake resilient box structure.\nGenerational durability.");
    setSections([
      {
        heading: "Introduction",
        paragraphs: ["Start your article content here with background context..."],
      },
    ]);
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setCoverImage(post.coverImage);
    setCoverImageAlt(post.coverImageAlt);
    setAuthorName(post.authorName);
    setAuthorRole(post.authorRole);
    setReadTime(post.readTime);
    setIsPublished(post.isPublished);
    setFeatured(post.featured);
    setMetaTitle(post.metaTitle || "");
    setMetaDescription(post.metaDescription || "");
    setMetaKeywords(post.metaKeywords || "");

    try {
      const parsedTags = JSON.parse(post.tags);
      setTagsInput(Array.isArray(parsedTags) ? parsedTags.join(", ") : "");
    } catch {
      setTagsInput(post.tags);
    }

    try {
      const parsedTakeaways = JSON.parse(post.keyTakeaways);
      setTakeawaysInput(Array.isArray(parsedTakeaways) ? parsedTakeaways.join("\n") : "");
    } catch {
      setTakeawaysInput(post.keyTakeaways);
    }

    try {
      const parsedSections = JSON.parse(post.sections);
      setSections(Array.isArray(parsedSections) ? parsedSections : []);
    } catch {
      setSections([]);
    }

    setIsEditorOpen(true);
  };

  // Upload Cover Image Handler
  const handleUploadCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blogs");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        if (!coverImageAlt) setCoverImageAlt(file.name.replace(/\.[^/.]+$/, ""));
      } else {
        alert("Failed to upload image. Please check file format.");
      }
    } catch (err) {
      console.error("Cover upload error", err);
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload Section Middle Image Handler
  const handleUploadSectionImage = async (e: ChangeEvent<HTMLInputElement>, sectionIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSectionIdx(sectionIdx);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blogs");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSections((prev) =>
          prev.map((sec, idx) =>
            idx === sectionIdx
              ? {
                  ...sec,
                  image: {
                    src: data.url,
                    alt: file.name.replace(/\.[^/.]+$/, ""),
                    caption: "Illustration from Vastu Vihar Nepal",
                  },
                }
              : sec
          )
        );
      }
    } catch (err) {
      console.error("Section image upload error", err);
    } finally {
      setUploadingSectionIdx(null);
    }
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: "",
        paragraphs: [""],
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSectionHeadingChange = (idx: number, val: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, heading: val } : s))
    );
  };

  const handleSectionParagraphsChange = (idx: number, val: string) => {
    const paras = val.split("\n\n").map((p) => p.trim()).filter(Boolean);
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, paragraphs: paras } : s))
    );
  };

  const handleSectionQuoteChange = (idx: number, val: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, quote: val } : s))
    );
  };

  const handleRemoveSectionImage = (idx: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, image: undefined } : s))
    );
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete blog error", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim()) {
      alert("Please provide an article title and cover image.");
      return;
    }

    setIsSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category: category.trim(),
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim(),
      coverImageAlt: coverImageAlt.trim() || title.trim(),
      readTime: readTime.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      isPublished,
      featured,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      keyTakeaways: takeawaysInput.split("\n").map((t) => t.trim()).filter(Boolean),
      sections,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      metaKeywords: metaKeywords.trim(),
    };

    try {
      if (editingPost) {
        const res = await fetch(`/api/admin/blogs/${editingPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setBlogs((prev) =>
            prev.map((p) => (p.id === editingPost.id ? { ...p, ...data.post } : p))
          );
          setIsEditorOpen(false);
        } else {
          const errData = await res.json();
          alert(errData.error || "Failed to update blog.");
        }
      } else {
        const res = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setBlogs((prev) => [data.post, ...prev]);
          setIsEditorOpen(false);
        } else {
          const errData = await res.json();
          alert(errData.error || "Failed to create blog.");
        }
      }
    } catch (err) {
      console.error("Save blog error", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.45rem", fontWeight: 700, color: "#011c5b" }}>
            Blog Articles & Publishing
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(1, 28, 91, 0.65)" }}>
            Create and edit thought leadership articles, upload cover thumbnails, add middle images, and set SEO meta tags.
          </p>
        </div>

        <button type="button" onClick={handleOpenCreate} className={commonStyles.btnPrimary}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Create New Blog Article</span>
        </button>
      </div>

      {/* Blogs Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.tableContainer}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Cover</th>
                <th>Title & Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    Loading blog posts...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    No blog posts found. Click &ldquo;Create New Blog Article&rdquo; to publish your first post.
                  </td>
                </tr>
              ) : (
                blogs.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ position: "relative", width: "72px", height: "48px", borderRadius: "8px", overflow: "hidden", background: "#e2e8f0" }}>
                        <Image
                          src={post.coverImage}
                          alt={post.coverImageAlt || post.title}
                          fill
                          sizes="72px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#011c5b", fontSize: "0.92rem", maxWidth: "380px" }}>
                        {post.title}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.25rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#0369a1", backgroundColor: "#e0f2fe", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                          {post.category}
                        </span>
                        {post.featured && (
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b45309", backgroundColor: "#fef3c7", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                            ★ Featured
                          </span>
                        )}
                        <span style={{ fontSize: "0.74rem", color: "rgba(1, 28, 91, 0.55)" }}>/{post.slug}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#011c5b" }}>{post.authorName}</div>
                      <div style={{ fontSize: "0.76rem", color: "rgba(1, 28, 91, 0.6)" }}>{post.authorRole}</div>
                    </td>

                    <td>
                      <span
                        className={`${commonStyles.pill} ${
                          post.isPublished ? commonStyles.pillConverted : commonStyles.pillClosed
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.8rem", color: "rgba(1, 28, 91, 0.6)" }}>
                      {post.publishedDate}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className={commonStyles.btnSecondary}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                          title="Preview public article"
                        >
                          View ↗
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          className={commonStyles.btnSecondary}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className={commonStyles.btnDanger}
                          title="Delete article"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Featured Blogger & Article Editor Modal */}
      {isEditorOpen && (
        <div className={commonStyles.modalBackdrop} onClick={() => setIsEditorOpen(false)}>
          <div
            className={`${commonStyles.modal} ${commonStyles.modalLarge}`}
            style={{ maxWidth: "960px", maxHeight: "94vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={commonStyles.modalHeader}>
              <div>
                <h3 className={commonStyles.modalTitle}>
                  {editingPost ? "Edit Blog Article" : "Write New Blog Article"}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(1, 28, 91, 0.6)", marginTop: "0.2rem" }}>
                  Complete article details, SEO meta tags, and inline middle content images.
                </p>
              </div>
              <button type="button" className={commonStyles.closeBtn} onClick={() => setIsEditorOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Cover / Thumbnail Box */}
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "16px", border: "1.5px dashed rgba(1, 28, 91, 0.15)" }}>
                <span className={commonStyles.label} style={{ marginBottom: "0.5rem", display: "block" }}>
                  1. Article Thumbnail / Cover Image *
                </span>

                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
                  {coverImage && (
                    <div style={{ position: "relative", width: "140px", height: "85px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(1, 28, 91, 0.1)" }}>
                      <Image src={coverImage} alt="Cover preview" fill sizes="140px" style={{ objectFit: "cover" }} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Image URL or upload file below..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className={commonStyles.input}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        disabled={uploadingCover}
                        className={commonStyles.btnSecondary}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {uploadingCover ? "Uploading..." : "Upload File"}
                      </button>
                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleUploadCover}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Image Alt text (e.g. Monolithic RCC reinforcement formwork)"
                      value={coverImageAlt}
                      onChange={(e) => setCoverImageAlt(e.target.value)}
                      className={commonStyles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Title & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Science of Raft Foundations in Seismic Zones"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingPost) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                        );
                      }
                    }}
                    className={commonStyles.input}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={commonStyles.select}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>URL Slug (/blog/slug)</label>
                  <input
                    type="text"
                    placeholder="custom-slug-here"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Author Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Excerpt / Lead Summary</label>
                <textarea
                  rows={2}
                  placeholder="Short introductory summary for cards and search results..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className={commonStyles.textarea}
                />
              </div>

              {/* Key Takeaways & Tags */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Key Takeaways (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Takeaway 1&#10;Takeaway 2&#10;Takeaway 3"
                    value={takeawaysInput}
                    onChange={(e) => setTakeawaysInput(e.target.value)}
                    className={commonStyles.textarea}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Tags (Comma-separated)</label>
                  <textarea
                    rows={3}
                    placeholder="Engineering, Monolithic RCC, Earthquake Safety, Vastu Vihar"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className={commonStyles.textarea}
                  />
                </div>
              </div>

              {/* 2. Middle Content & Sections (Blogger Style) */}
              <div style={{ borderTop: "1px solid rgba(1, 28, 91, 0.1)", paddingTop: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#011c5b" }}>
                      2. Article Content Sections & Inline Images
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.6)" }}>
                      Break your blog into readable headings, paragraphs, and upload middle images.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSection}
                    className={commonStyles.btnSecondary}
                    style={{ fontSize: "0.78rem", padding: "0.4rem 0.85rem" }}
                  >
                    + Add Content Section
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {sections.map((section, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid rgba(1, 28, 91, 0.1)",
                        borderRadius: "14px",
                        padding: "1.25rem",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#08aaec" }}>
                          Section #{idx + 1}
                        </span>

                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            Remove Section
                          </button>
                        )}
                      </div>

                      <div className={commonStyles.formGroup}>
                        <label className={commonStyles.label}>Section Heading (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. How Single-Pour Monolithic Pouring Works"
                          value={section.heading || ""}
                          onChange={(e) => handleSectionHeadingChange(idx, e.target.value)}
                          className={commonStyles.input}
                        />
                      </div>

                      <div className={commonStyles.formGroup}>
                        <label className={commonStyles.label}>Paragraphs (Double newline for separate paragraphs)</label>
                        <textarea
                          rows={4}
                          placeholder="Write section narrative here..."
                          value={section.paragraphs.join("\n\n")}
                          onChange={(e) => handleSectionParagraphsChange(idx, e.target.value)}
                          className={commonStyles.textarea}
                        />
                      </div>

                      {/* Middle Image Option */}
                      <div style={{ marginTop: "0.85rem", padding: "0.85rem", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(1, 28, 91, 0.08)" }}>
                        <span className={commonStyles.label} style={{ fontSize: "0.78rem" }}>
                          Inline Middle Image (Optional)
                        </span>

                        {section.image ? (
                          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                            <div style={{ position: "relative", width: "100px", height: "65px", borderRadius: "6px", overflow: "hidden" }}>
                              <Image src={section.image.src} alt={section.image.alt} fill sizes="100px" style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{section.image.alt}</div>
                              <div style={{ fontSize: "0.74rem", color: "rgba(1, 28, 91, 0.6)" }}>{section.image.src}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSectionImage(idx)}
                              className={commonStyles.btnDanger}
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            <label className={commonStyles.btnSecondary} style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", cursor: "pointer" }}>
                              {uploadingSectionIdx === idx ? "Uploading..." : "📷 Upload Middle Image"}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => handleUploadSectionImage(e, idx)}
                              />
                            </label>
                            <span style={{ fontSize: "0.74rem", color: "rgba(1, 28, 91, 0.55)" }}>
                              Upload an infographic, blueprint or on-site photo for this section
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={commonStyles.formGroup} style={{ marginTop: "0.85rem" }}>
                        <label className={commonStyles.label}>Highlight Quote / Callout (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. A monolithic home does not resist earthquake energy with isolated pillars..."
                          value={section.quote || ""}
                          onChange={(e) => handleSectionQuoteChange(idx, e.target.value)}
                          className={commonStyles.input}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SEO Meta Fields */}
              <div style={{ borderTop: "1px solid rgba(1, 28, 91, 0.1)", paddingTop: "1.25rem" }}>
                <h4 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#011c5b", marginBottom: "0.85rem" }}>
                  3. SEO & OpenGraph Meta Fields
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={commonStyles.formGroup}>
                    <label className={commonStyles.label}>Meta Title</label>
                    <input
                      type="text"
                      placeholder="Title tag for Google & Social Shares"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className={commonStyles.input}
                    />
                  </div>

                  <div className={commonStyles.formGroup}>
                    <label className={commonStyles.label}>Meta Keywords</label>
                    <input
                      type="text"
                      placeholder="nepal construction, monolithic rcc, vastu vihar"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className={commonStyles.input}
                    />
                  </div>
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Search engine meta description snippet..."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className={commonStyles.textarea}
                  />
                </div>
              </div>

              {/* Publish Options & Action Buttons */}
              <div style={{ borderTop: "1px solid rgba(1, 28, 91, 0.1)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", fontWeight: 600, color: "#011c5b", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", fontWeight: 600, color: "#011c5b", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Feature on Homepage / Top</span>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className={commonStyles.btnSecondary}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className={commonStyles.btnPrimary}
                  >
                    {isSaving ? "Saving..." : editingPost ? "Save & Update Article" : "Publish Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
