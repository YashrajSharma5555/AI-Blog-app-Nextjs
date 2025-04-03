"use client"; // Required for using useEffect in Next.js App Router

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold dark:text-white mb-6 text-center"> Recent Blogs</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blog/${blog.slug}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={blog.coverImage || "/placeholder.jpg"} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-4 bg-sky-300">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-sm text-gray-600">{blog.content.slice(0, 100)}...</p>
                <p className="text-xs text-gray-700 mt-1">By {blog.author.name} </p>
                <p className="text-xs text-gray-700 mt-1"> {blog.category.name} </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
