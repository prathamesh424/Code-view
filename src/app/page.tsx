import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { LanguageShowcase } from '@/components/landing/LanguageShowcase';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <LanguageShowcase />

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted">
            CodeView — Interactive Code Visualizer &amp; Debugger. Built with Next.js, Monaco Editor, and Framer Motion.
          </p>
        </div>
      </footer>
    </div>
  );
}
