"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

const CategoryPage = () => {
    const router = useRouter();
    const { slug } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`/api/category/${slug}`);
                if (!response.ok) throw new Error("Failed to fetch blogs");
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchBlogs();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-6 capitalize">{slug} Blogs</h1>
            {blogs.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
                    No blogs available in this category.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}  // ✅ Fixed key issue
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer
                                       transition-all hover:shadow-xl hover:bg-sky-100 dark:hover:bg-gray-700"
                            onClick={() => router.push(`/blog/${blog.slug}`)}
                        >
                            <img 
                                src={blog.coverImage || "/placeholder.jpg"} 
                                alt={blog.title} 
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                    {blog.excerpt || "Read more about this topic..."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
