import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { UserBlogReader } from '@/components/blog/UserBlogs';
import { getStaticBlogPost, getAllStaticBlogSlugs, STATIC_BLOG_POSTS } from '@/lib/blogs-data';
import { renderMarkdown } from '@/lib/markdown';

export const revalidate = 86400; // Next.js ISR: updates page at next build and serves statically

const SITE_URL = 'https://www.codevisualizer.app';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const staticSlugs = getAllStaticBlogSlugs().map((slug) => ({ slug }));

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return staticSlugs;

  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'userBlogs:listForSitemap',
        args: {},
        format: 'json',
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return staticSlugs;
    const data = await res.json();
    const userSlugs = (data.value ?? []).map((b: { slug: string }) => ({
      slug: b.slug,
    }));
    return [...staticSlugs, ...userSlugs];
  } catch {
    return staticSlugs;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const staticPost = getStaticBlogPost(slug);

  if (staticPost) {
    const title = `${staticPost.title} | Code Visualizer`;
    const url = `${SITE_URL}/blog/${staticPost.slug}`;
    return {
      title,
      description: staticPost.summary,
      keywords: staticPost.seoKeywords,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description: staticPost.summary,
        url,
        type: 'article',
        publishedTime: staticPost.publishedAt,
        authors: [staticPost.authorName],
        tags: staticPost.tags,
        images: [
          {
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: staticPost.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: staticPost.summary,
        images: [`${SITE_URL}/og-image.png`],
      },
    };
  }

  // Fallback for user-submitted blogs
  const readableTitle = slug.replace(/-/g, ' ');
  const title = `Blog: ${readableTitle} | Code Visualizer`;
  const description = `Read about ${readableTitle} on Code Visualizer and understand how it works under the hood with step-by-step visualizations.`;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const staticPost = getStaticBlogPost(slug);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  // If this is one of our official pre-rendered static articles
  if (staticPost) {
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: staticPost.title, item: postUrl },
      ],
    };

    const blogPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: staticPost.title,
      description: staticPost.summary,
      url: postUrl,
      mainEntityOfPage: postUrl,
      datePublished: staticPost.publishedAt,
      author: {
        '@type': 'Organization',
        name: staticPost.authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Code Visualizer',
        url: SITE_URL,
        logo: `${SITE_URL}/apple-touch-icon.png`,
      },
      image: `${SITE_URL}/og-image.png`,
      keywords: staticPost.seoKeywords.join(', '),
    };

    // Filter other static posts for the bottom "Read next" section
    const otherPosts = STATIC_BLOG_POSTS.filter((p) => p.slug !== staticPost.slug).slice(0, 3);

    return (
      <div className="min-h-screen bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbJsonLd, blogPostingJsonLd]),
          }}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Back navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to all articles
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {staticPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 border border-accent/20 text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
              {staticPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted pb-6 border-b border-border">
              <span className="font-semibold text-foreground/90">{staticPost.authorName}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(staticPost.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {staticPost.readTime}
              </span>
            </div>
          </header>

          {/* Lead Summary */}
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/5 text-sm sm:text-base text-foreground/90 leading-relaxed mb-8 italic">
            {staticPost.summary}
          </div>

          {/* Article Body */}
          <div
            className="prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(staticPost.content) }}
          />

          {/* Interactive Playground CTA */}
          {staticPost.cta && (
            <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface to-surface-secondary shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    Try This Interactively
                  </h3>
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    {staticPost.cta.text}
                  </p>
                  <Link
                    href={staticPost.cta.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg"
                  >
                    {staticPost.cta.buttonLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Read next articles */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Explore Related Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="p-4 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-surface-secondary/40 transition-all flex flex-col group"
                >
                  <span className="text-[11px] font-medium text-accent mb-2">
                    {post.tags[0]}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted line-clamp-2 mt-auto">
                    {post.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Fallback for user-submitted community articles
  const postTitle = slug.replace(/-/g, ' ');
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: postTitle, item: postUrl },
    ],
  };

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    description: `Read about ${postTitle} on Code Visualizer.`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Code Visualizer',
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
    },
    image: `${SITE_URL}/og-image.png`,
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
        <UserBlogReader slug={slug} isRoute />
      </article>
    </div>
  );
}
