import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SITE_URL,
  VALID_PLAYGROUND_LANGS,
  getPlaygroundSEO,
} from "@/lib/playground-seo";

/** Pre-render all language playground pages at build time */
export function generateStaticParams() {
  return VALID_PLAYGROUND_LANGS.map((lang) => ({ lang }));
}

/** Dynamic metadata per language */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const config = getPlaygroundSEO(lang);
  if (!config) return notFound();

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: `${SITE_URL}${config.canonical}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}${config.canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

export default async function LanguagePlaygroundLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const config = getPlaygroundSEO(lang);
  if (!config) return notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Playground",
        item: `${SITE_URL}/playground`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${config.displayName} Playground`,
        item: `${SITE_URL}${config.canonical}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.title,
    description: config.description,
    url: `${SITE_URL}${config.canonical}`,
    isPartOf: { "@type": "WebSite", url: SITE_URL },
    about: {
      "@type": "Thing",
      name: `${config.displayName} Online Code Playground`,
    },
    educationalLevel: "Beginner to Advanced",
    learningResourceType: "Interactive playground",
  };

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${config.displayName} Playground — Code Visualizer`,
    description: config.description,
    url: `${SITE_URL}${config.canonical}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd,
            faqJsonLd,
            webPageJsonLd,
            softwareAppJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
