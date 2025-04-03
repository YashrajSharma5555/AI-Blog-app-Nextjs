"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const EditBlogPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blog/${id}`);
                if (!response.ok) throw new Error("Failed to fetch blog data");

                const blog = await response.json();
                setTitle(blog.title);
                setContent(blog.content);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) throw new Error("Failed to update blog");

            router.push("/profile");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-5 bg-white dark:bg-gray-700 shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Content</label>
                    <textarea
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Update Blog
                </button>
            </form>
        </div>
    );
};

export default EditBlogPage;
