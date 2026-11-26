export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path?: string }> }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vastuviharnepal.com";
  const crumbs = [{ name: "Home", path: "/" }, ...items];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map(({ name, path }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          ...(path ? { item: `${siteUrl}${path}` } : {}),
        })),
      }}
    />
  );
}
