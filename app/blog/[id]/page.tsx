"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from "react";
import blogData from "../../../public/blogdata";
import BlogsSection from "../page";

export default function BlogDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [blog, setBlog] = useState<typeof blogData[0] | undefined>(undefined);

  useEffect(() => {
    const found = blogData.find((b) => String(b.id) === id);
    setBlog(found);
  }, [id]);

  if (!blog) {
    return (
      <p className="text-center mt-10 text-red-600">Blog not found!</p>
    );
  }

  return (
    <>
      <div className="bg-white min-h-screen pb-10">
        <Navbar />

        <div className="bg-green-900 text-white">
          <div className="w-full h-[400px] pb-16 flex flex-col items-center justify-center relative overflow-hidden px-2">
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
              Happy Buyers, Real Stories
            </h2>
            <p className="mt-3 text-base font-normal tracking-tight text-center">
              Stories from happy buyers who found their car with DriveXDeals.
            </p>

            <div className="w-full max-w-8xl mt-6">
              {/* <SearchBar /> */}
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left content - Text Section */}
          <div className="md:col-span-2 flex flex-col justify-center pl-8 md:pl-16">
            {/* Added left padding here */}
            <h2 className="text-[36px] font-semibold text-start mb-12">Story</h2>

            <p className="mb-4 text-teal-700 font-semibold text-2xl leading-none">
              #SuccessStory #CustomerExperience #CarPurchase
            </p>

            <p className="text-gray-800 text-2xl mb-6 whitespace-pre-line">{blog.description}</p>

            <p className="text-lg">
              <span className="text-red-600 text-[40px] font-semibold">Want to get your dream car too? </span>
              <span className="text-teal-800 text-[40px] font-semibold cursor-pointer hover:underline">
                Browse our latest listings today!
              </span>
            </p>
          </div>

          {/* Right content - Image Section */}
          <div className="flex justify-center items-center">
            <img
              src={`/${blog.imgSrc}`}
              alt={blog.title}
              className="rounded-2xl w-[616px] h-[500px] object-cover"
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-8 flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-teal-800 text-white rounded hover:bg-teal-900 transition"
          >
            Explore Cars
          </button>
        </div>
        <BlogsSection limit={3}
        sectionSubtitle=""
        sectionTitle=""
        seeMoreLink=""/>
      </div>
    </>
  );
}
