"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";

const BlogPostPage = () => {
    const router = useRouter();
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${slug}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch post");
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500 dark:text-sky-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500 dark:text-red-400">
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto px-4 py-10 bg-blue-500s dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <h1 className="text-4xl mx-auto w-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-600 mx-auto w-4xl dark:text-gray-400 text-sm">
                By <span className="font-semibold">{post.author.name}</span> | Category: <span className="font-semibold">{post.category.name}</span>
            </p>
            <Image 
  src={post.coverImage || "/placeholder.jpg"} 
  alt={post.title} 
  width={1024}  // Adjust as needed
  height={256}  // h-64 = 64 * 4 = 256px
  className="w-full h-64 mx-auto object-cover rounded-md my-6"
/>


            {/* ✅ Ensure text is properly formatted with indentation and line breaks */}
            <div className="prose prose-lg mx-auto w-4xl dark:prose-invert">
                {post.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 indent-8">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default BlogPostPage;
