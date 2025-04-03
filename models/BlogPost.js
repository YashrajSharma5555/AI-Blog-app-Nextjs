import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-friendly title
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required:true },
    coverImage: { type: String }, // Image URL
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)