import { UserBlogReader } from '@/components/blog/UserBlogs';

export const revalidate = 86400; // Next.js ISR: updates page at next build and serves statically

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <UserBlogReader slug={resolvedParams.slug} onBack={() => {}} isRoute />
      </div>
    </div>
  );
}
