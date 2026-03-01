import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const SITE_URL = "https://www.codevisualizer.app";
const SITE_NAME = "CodeView";
const SITE_DESCRIPTION =
  "Visualize code execution in real-time. See the event loop, call stack, memory layout, heap, and internal engine workings for JavaScript, Python, C++, and Java — step by step.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d17" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "CodeView — Interactive Code Visualizer & Debugger Online | JS, Python, C++, Java",
    template: "%s | CodeView — Code Visualizer",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "code visualizer",
    "code execution visualizer",
    "javascript visualizer",
    "python visualizer",
    "event loop visualizer",
    "call stack visualizer",
    "memory visualizer",
    "online debugger",
    "stack and heap",
    "code debugger online",
    "python tutor alternative",
    "javascript event loop",
    "cpp visualizer",
    "java visualizer",
    "code runner online",
    "visual debugger",
    "step by step code execution",
    "programming visualizer",
  ],
  authors: [{ name: "CodeView Team", url: SITE_URL }],
  creator: "CodeView",
  publisher: "CodeView",
  category: "Developer Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "CodeView — Interactive Code Visualizer & Debugger Online",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CodeView — Interactive Code Visualizer & Debugger for JavaScript, Python, C++, and Java",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeView — Interactive Code Visualizer & Debugger Online",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@codevisualizer",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  verification: {
    // Replace with your actual Google Search Console verification code
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  other: {
    "msapplication-TileColor": "#6366f1",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

/* ── Structured Data (JSON-LD) ── */

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CodeView",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "CodeView",
    url: SITE_URL,
  },
  featureList: [
    "Real-time code execution visualization",
    "Event loop visualization",
    "Call stack & memory layout",
    "Stack and heap visualization",
    "Multi-language support (JavaScript, Python, C++, Java)",
    "Online code debugger",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  softwareVersion: "1.0",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: "CodeView",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/apple-touch-icon.png`,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/playground?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CodeView",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              softwareAppJsonLd,
              websiteJsonLd,
              organizationJsonLd,
            ]),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
