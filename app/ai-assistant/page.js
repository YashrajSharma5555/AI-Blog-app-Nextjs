"use client";

import React, { useState } from "react";

export default function AiAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]); // store chat history
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      const botResponse = data.response || "No response from model";

      // Append new query + response to chat history
      setMessages((prev) => [
        ...prev,
        { type: "user", text: query },
        { type: "AI Agent", text: botResponse },
      ]);
      setQuery(""); // clear input
    } catch (error) {
      console.error("Error fetching from API:", error);
      setMessages((prev) => [
        ...prev,
        { type: "user", text: query },
        { type: "AI Agent", text: "Error fetching response" },
      ]);
      setQuery("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        AI Assistant
      </h1>

     

      <div className="mt-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              msg.type === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
            }`}
          >
           {msg.type}: {msg.text}
          </div>
        ))}
      </div>

       <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded mb-2 mt-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
