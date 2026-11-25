import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsData, projectsList } from "@/data/projects";
import { PageHero } from "@/components/common/PageHero";
import { ModelDetailClient } from "./ModelDetailClient";

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projectsList.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return {
      title: "Model Not Found | Vastu Vihar Nepal",
    };
  }

  const heroImage = project.gallery?.[0] || "/hero/models-hero.webp";

  return {
    title: `${project.name} | Vastu Vihar Nepal`,
    description: project.description,
    openGraph: {
      title: `${project.name} | Vastu Vihar Nepal`,
      description: project.description,
      images: [
        {
          url: heroImage,
          alt: project.name,
        },
      ],
    },
  };
}

export default async function ModelDetailPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    notFound();
  }

  const modelBadge = project.modelTypes[0]?.modelName;
  const heroImage = project.gallery?.[0] || "/hero/models-hero.webp";

  return (
    <main>
      <PageHero
        location={[
          { label: "Home", href: "/" },
          { label: "Models", href: "/models" },
          { label: project.name },
        ]}
        bgImage={heroImage}
        bgImageAlt={project.name}
        headingLine1={project.name}
        headingLine2={modelBadge ? `(${modelBadge})` : undefined}
        price={project.price || "Price on Request"}
        description={project.description}
      />
      <ModelDetailClient project={project} />
    </main>
  );
}
