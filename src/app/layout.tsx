import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.codevisualizer.app";
const SITE_NAME = "CodeView";
const SITE_DESCRIPTION =
  "Visualize code execution in real-time. See the event loop, call stack, memory layout, heap, and internal engine workings for JavaScript, Python, C++, and Java — step by step.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CodeView — Interactive Code Visualizer & Debugger Online",
    template: "%s | CodeView",
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
  ],
  authors: [{ name: "CodeView Team" }],
  creator: "CodeView",
  publisher: "CodeView",
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
        alt: "CodeView — Interactive Code Visualizer & Debugger",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeView — Interactive Code Visualizer & Debugger Online",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
