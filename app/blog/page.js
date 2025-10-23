"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [chatResponse, setChatResponse] = useState("");
const [userMessage, setUserMessage] = useState("");
const [summarizingBlogId, setSummarizingBlogId] = useState(null);
const [summaryResp, setSummaryResp] = useState(null);
const [chatSendBtn, setChatSendBtn] = useState(false);


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

  const handleSummarize = async (blog) => {
      setSummarizingBlogId(blog._id); // start loading

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_BASE_URL}/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        query: "summarize this blog",
        QdrantColl: "blog_collection", 
        blog: blog.content,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to summarize");
      }

      const data = await res.json();
      console.log("summary",data)
      const summary = data.summary ?? data.result ?? data.response?? JSON.stringify(data);
      setSummaryResp(summary)
    } catch (error) {
      console.error("Error summarizing blog:", error);
      alert("Error summarizing blog. See console for details.");
    }finally{
          setSummarizingBlogId(null); // stop loading

    }
  };


  const handleChat = async (blog) => {
    
    setChatSendBtn(true)
    console.log("blog",selectedBlog)
    if (!userMessage.trim()) {
      alert("Please enter a message before sending.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_BASE_URL}/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        query: `${userMessage}. Please answer based only on the blog titled "${blog.title}"`,        
      QdrantColl: "blog_collection",
        blog: blog.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to get chat response");

      const data = await res.json();
      setChatResponse(data.response || "No response received.");
    } catch (error) {
      console.error("Error chatting with blog:", error);
      setChatResponse("Something went wrong while chatting.");
    }finally{
      setChatSendBtn(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold dark:text-white mb-6 text-center">
        Recent Blogs
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
            >
              <Link href={`/blog/${blog.slug}`} className="block">
                <Image
                  src={blog.coverImage || "/placeholder.jpg"}
                  alt={blog.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-sky-300">
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-600">
                    {blog.content.slice(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    By {blog.author.name}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    {blog.category.name}
                  </p>
                </div>
              </Link>

              {/* Buttons inside each blog card */}
              <div className="flex gap-4 p-4">
                <button
                  className="bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleSummarize(blog)}
                disabled={summarizingBlogId === blog._id}
>
  {summarizingBlogId === blog._id ? "Summarizing..." : "Summarize Blog with AI"}
                </button>

                <button
                  className="bg-green-600 text-white px-1 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    setShowChatModal(true), setSelectedBlog(blog);
                  }}
                >
                  Talk to Blog AI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

     {summaryResp && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-black p-6 rounded-lg w-auto flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="text-white">{summaryResp}</p>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => setSummaryResp(null)}
      >
        Close
      </button>
    </div>
  </div>
)}

      {showChatModal && (
        <div className="fixed inset-0   bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Chat with Blog:{" "}
              <span className="text-sky-400">{selectedBlog.title}</span>
            </h2>{" "}
            <textarea
              className="w-full h-40 border p-2 rounded mb-4"
              placeholder="Type your message..."
                value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            ></textarea>


          {chatResponse && (
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm text-gray-700 dark:text-gray-200 mb-3">
                <strong>AI:</strong> {chatResponse}
              </div>
            )}


            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowChatModal(false)}
              >
                Close
              </button>
              <button 
              onClick={()=>handleChat(selectedBlog)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {chatSendBtn ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
