import type { Metadata } from "next";

const SITE_URL = "https://www.codevisualizer.app";

export const metadata: Metadata = {
  title: "SQL Playground — Run SQL Queries Online | Free SQL Editor",
  description:
    "Practice SQL queries in your browser with our free online SQL playground. Execute SELECT, JOIN, GROUP BY, subqueries, and window functions on a pre-loaded sample database — no signup required.",
  keywords: [
    "sql playground online",
    "run sql online",
    "sql editor online",
    "practice sql queries",
    "sql fiddle alternative",
    "online sql compiler",
    "sql query runner",
    "sql tutorial interactive",
    "learn sql online free",
    "sql practice problems",
    "sqlite online",
    "sql join examples",
    "sql group by tutorial",
    "sql window functions",
    "sql subquery practice",
    "free sql editor",
  ],
  alternates: {
    canonical: `${SITE_URL}/sql-playground`,
  },
  openGraph: {
    title: "SQL Playground — Run SQL Queries Online | Code Visualizer",
    description:
      "Free in-browser SQL editor. Write and run SQL queries instantly on a sample database with departments, employees, and orders tables.",
    url: `${SITE_URL}/sql-playground`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SQL Playground — Online SQL Query Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Playground — Run SQL Queries Online Free",
    description:
      "Write and execute SQL queries in your browser. Practice SELECT, JOIN, GROUP BY, window functions, and more on a pre-loaded sample database.",
  },
};

export default function SqlPlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
