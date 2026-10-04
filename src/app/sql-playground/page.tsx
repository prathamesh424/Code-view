'use client';

import { Database } from 'lucide-react';
import Link from 'next/link';
import { SqlPlayground } from '@/components/visualizer-tools/sql/SqlPlayground';

const sqlJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SQL Playground — Code Visualizer",
  description:
    "Free online SQL playground to practice SQL queries. Execute SELECT, JOIN, GROUP BY, subqueries, and window functions on a pre-loaded sample database.",
  url: "https://www.codevisualizer.app/sql-playground",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const sqlBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "SQL Playground", item: "https://www.codevisualizer.app/sql-playground" },
  ],
};

const sqlFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this SQL Playground free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the SQL Playground is completely free. It runs entirely in your browser using WebAssembly — no account, no server, no limits.",
      },
    },
    {
      "@type": "Question",
      name: "What SQL dialect does it support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The playground uses SQLite (via sql.js), which supports standard SQL including JOINs, subqueries, CTEs, window functions, and more. Most SQL interview questions can be practiced here.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data saved?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Data exists only in your browser session. Refreshing the page resets the database to its default state. Use the Reset DB button to restore the original sample data at any time.",
      },
    },
    {
      "@type": "Question",
      name: "Can I create my own tables?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can run CREATE TABLE, INSERT, UPDATE, DELETE, and any DDL/DML statements. The schema explorer updates automatically to show your new tables.",
      },
    },
  ],
};

export default function SqlPlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([sqlJsonLd, sqlBreadcrumbJsonLd, sqlFaqJsonLd]) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            <Database className="w-7 h-7 sm:w-8 sm:h-8 inline mr-3 text-accent -mt-1" />
            SQL Playground
          </h1>
          <p className="text-muted text-sm max-w-2xl">
            Write and execute SQL queries directly in your browser. Pre-loaded with a sample database 
            featuring departments, employees, and orders tables. No signup or backend required — powered 
            by SQLite compiled to WebAssembly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/playground"
              className="px-3 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
            >
              Code Playground
            </Link>
            <Link
              href="/algorithms"
              className="px-3 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
            >
              Algorithm Visualizer
            </Link>
            <Link
              href="/tools"
              className="px-3 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
            >
              Developer Tools
            </Link>
          </div>
        </div>

        {/* SQL Playground Component */}
        <SqlPlayground />

        {/* SEO Content Section */}
        <section id="sql-playground-info" className="mt-12 pt-8 border-t border-border space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Free Online SQL Playground — Practice SQL Queries in Your Browser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">What is the SQL Playground?</h3>
              <p>
                Code Visualizer&apos;s SQL Playground is a free, browser-based SQL editor that lets you write 
                and run SQL queries instantly. Powered by SQLite compiled to WebAssembly (sql.js), it runs 
                entirely in your browser with zero setup — no database installation, no server, no signup. 
                It&apos;s the fastest way to practice SQL queries, prepare for technical interviews, or learn 
                SQL from scratch.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">What SQL Features Are Supported?</h3>
              <p>
                Execute any standard SQL including SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, 
                JOIN (INNER, LEFT, RIGHT, CROSS), GROUP BY, HAVING, ORDER BY, subqueries, Common Table 
                Expressions (CTEs), window functions (RANK, ROW_NUMBER, SUM OVER), CASE expressions, 
                and aggregate functions. The playground supports the full SQLite SQL dialect.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Pre-loaded Sample Database</h3>
              <p>
                The playground comes pre-loaded with a realistic sample database containing departments 
                (id, name, location, budget), employees (id, name, department, salary, hire_date, email), 
                and orders (id, employee_id, product, amount, order_date) tables. This schema is designed 
                to practice real-world SQL patterns like JOINs, aggregations, and analytical queries.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Perfect for Interview Prep</h3>
              <p>
                SQL is one of the most tested skills in data engineering, backend, and data science interviews. 
                Use the SQL Playground to practice common interview patterns: finding the second-highest salary, 
                department-level aggregations, self-joins, running totals with window functions, and complex 
                subqueries. Build muscle memory by writing queries from scratch.
              </p>
            </div>
          </div>

          {/* FAQ for SEO */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                {
                  q: 'Is this SQL Playground free to use?',
                  a: 'Yes, the SQL Playground is completely free. It runs entirely in your browser using WebAssembly — no account, no server, no limits.',
                },
                {
                  q: 'What SQL dialect does it support?',
                  a: 'The playground uses SQLite (via sql.js), which supports standard SQL including JOINs, subqueries, CTEs, window functions, and more. Most SQL interview questions can be practiced here.',
                },
                {
                  q: 'Is my data saved?',
                  a: 'Data exists only in your browser session. Refreshing the page resets the database to its default state. Use the Reset DB button to restore the original sample data at any time.',
                },
                {
                  q: 'Can I create my own tables?',
                  a: 'Yes! You can run CREATE TABLE, INSERT, UPDATE, DELETE, and any DDL/DML statements. The schema explorer updates automatically to show your new tables.',
                },
              ].map((faq, i) => (
                <div key={i} className="bg-surface rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">{faq.q}</h4>
                  <p className="text-sm text-muted mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
