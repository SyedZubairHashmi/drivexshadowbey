import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogData, BlogPost } from '@/types/blog';
import GallerySection from "@/components/automotive/gallery/GallerySection";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";

interface BlogDetailProps {
  params: {
    id: string;
  };
}

export default function BlogDetail({ params }: BlogDetailProps) {
  const { id } = params;
  const blog = blogData.find((b: BlogPost) => String(b.id) === id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {blog.title}
          </h1>
          <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
            Real stories from happy DriveXDeal customers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <article className="lg:col-span-2">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/features/automotive/blog" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stories
              </Link>
            </div>

            {/* Blog Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={`/${blog.imgSrc}`}
                alt={blog.title}
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">

              <p className="mb-4 text-teal-700 font-semibold text-2xl leading-none">
                #SuccessStory #CustomerExperience #CarPurchase
              </p>

              <p className="text-lg text-gray-700 mb-8 whitespace-pre-line">
                {blog.description}
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">More Stories</h2>
              <div className="space-y-4">
                {blogData
                  .filter((b: BlogPost) => b.id !== blog.id)
                  .slice(0, 3)
                  .map((relatedBlog: BlogPost) => (
                    <Link 
                      key={relatedBlog.id}
                      href={`/features/automotive/blog/${relatedBlog.id}`}
                      className="group flex items-start space-x-3 hover:bg-white p-2 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                        <Image
                          src={`/${relatedBlog.imgSrc}`}
                          alt={relatedBlog.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link 
                  href="/features/automotive/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  View all stories
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Featured Sections */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">You Might Also Like</h2>
          <GallerySection />
          <div className="mt-12">
            <AccessoriesSection />
          </div>
        </div>
      </section>

    </div>
  );
}
