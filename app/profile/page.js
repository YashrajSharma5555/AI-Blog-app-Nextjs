"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Trash2, Pencil } from "lucide-react";

const ProfilePage = () => {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const response = await fetch(`/api/profile`); // Fetch user blogs from API
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch blogs");
                }
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await fetch(`/api/profile`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete blog");
            }

            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

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
                <p className="text-lg">{"Please Login !"}</p>
            </div>
        );
    }

    return (
        <div className="max-w-full min-h-full mx-auto px-4 py-10 bg-blue-300 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold text-center mb-6">My Blogs</h1>
            {blogs.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
    You haven&#39;t posted any blogs yet.
</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer
                                       transition-all hover:shadow-xl hover:bg-sky-100 dark:hover:bg-gray-600"
                        >
                           <Image 
  src={blog.coverImage || "/placeholder.jpg"} 
  alt={blog.title} 
  width={500} 
  height={300} 
  className="w-full h-40 object-cover"
/>

                            <div className="p-5">
                                <h2 
                                    className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer"
                                    onClick={() => router.push(`/blog/${blog.slug}`)}
                                >
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                    {blog.excerpt || "Read more about this topic..."}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex justify-between mt-4">
                                    {/* Edit Button */}
                                    <button
                                        className="flex  items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                        onClick={() => router.push(`/blog/edit/${blog._id}`)}
                                    >
                                        <Pencil className="w-5 h-5  mr-1" /> Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="flex items-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                        onClick={() => handleDelete(blog._id)}
                                    >
                                        <Trash2 className="w-5 h-5 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
