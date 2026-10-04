import { UserBlogReader } from '@/components/blog/UserBlogs';
import { Metadata } from 'next';

export const revalidate = 86400; // Next.js ISR: updates page at next build and serves statically

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return [];
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "userBlogs:listForSitemap",
        args: {},
        format: "json",
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.value ?? []).map((b: { slug: string }) => ({
      slug: b.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const title = `Blog: ${resolvedParams.slug.replace(/-/g, ' ')} | Code Visualizer`;
  const description = `Read about ${resolvedParams.slug.replace(/-/g, ' ')} on Code Visualizer and understand how it works under the hood with step-by-step visualizations.`;
  const url = `https://www.codevisualizer.app/blog/${resolvedParams.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: "https://www.codevisualizer.app/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.codevisualizer.app/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const postUrl = `https://www.codevisualizer.app/blog/${resolvedParams.slug}`;
  const postTitle = resolvedParams.slug.replace(/-/g, ' ');

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.codevisualizer.app/blog" },
      { "@type": "ListItem", position: 3, name: postTitle, item: postUrl },
    ],
  };

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTitle,
    description: `Read about ${postTitle} on Code Visualizer.`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    publisher: {
      "@type": "Organization",
      name: "Code Visualizer",
      url: "https://www.codevisualizer.app",
      logo: "https://www.codevisualizer.app/apple-touch-icon.png",
    },
    image: "https://www.codevisualizer.app/og-image.png",
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, blogPostingJsonLd]),
        }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <UserBlogReader slug={resolvedParams.slug} isRoute />
      </article>
    </div>
  );
}
