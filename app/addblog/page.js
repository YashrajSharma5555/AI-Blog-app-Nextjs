"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NewPost() {
  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [author, setAuthor] = useState("");

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const res = await fetch("/api/loggedInUser");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        if (data?.user?.email) setAuthor(data.user.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    if (status === "authenticated") fetchAuthor();
  }, [status]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handlePublish = async () => {
    if (!title || !content || !category || !imageUrl || !author) {
      alert("Please fill all fields!");
      return;
    }
    const postData = { title, content, author, category, coverImage: imageUrl };
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        alert("Post published successfully!");
        setTitle(""); setContent(""); setCategory(""); setImageUrl("");
      } else {
        alert("Failed to publish post.");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Error publishing post.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    className="max-w-7xl mx-auto p-6   bg-white dark:bg-gray-800 shadow-xl rounded-lg">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create a New Blog Post</h1>

      {status === "unauthenticated" && (
        <p className="text-red-500">You must be logged in to create a post.</p>
      )}

      {status === "authenticated" && (
        <>
          <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="mb-4 text-gray-800 dark:text-white dark:bg-gray-700" />

          <Textarea placeholder="Write your content here..." value={content} onChange={(e) => setContent(e.target.value)}
            className="mb-4 text-gray-800 h-64 dark:text-white dark:bg-gray-700" />

<Select onValueChange={setCategory}>
  <SelectTrigger className="w-full mb-10">
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((cat) => (
      <SelectItem key={cat._id} value={cat._id}>
        {cat.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          <div className="border-2 w-3xl border-dashed mx-auto border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-col items-center">
            <ImageUpload onUpload={(url) => setImageUrl(url)} />
            {imageUrl && (
              <div className="mt-4 relative">
<Image 
  src={imageUrl} 
  alt="Uploaded preview" 
  width={192}  // w-48 = 48 * 4 = 192px
  height={192} // h-48 = 48 * 4 = 192px
  className="w-48 h-48 object-cover rounded-lg shadow-md"
/>
              </div>
            )}
          </div>

          <Button onClick={handlePublish} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-80 transition">
            Post Blog
          </Button>
        </>
      )}
    </motion.div>
  );
}
