import dbConnect from "@/utils/db";
import BlogPost from "@/models/BlogPost";
import User from "@/models/User"; // Import User model
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import slugify from "slugify"; // To generate a URL-friendly slug

export async function GET() {
    await dbConnect();
    try {
        const posts = await BlogPost.find({})
            .populate("author", "name") // Get author's name only
            .populate("category", "name") // Get category name only
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .exec();

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        console.log("Received Body:", body);

        const { title, content, author, category, coverImage } = body;
        if (!title || !content || !author || !category) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await User.findOne({ email: author }).select("_id");
        console.log("Found User:", user);






        if (!user) {
            return NextResponse.json({ error: "Author not found" }, { status: 404 });
        }

        const slug = slugify(title, { lower: true, strict: true });
        const newPost = new BlogPost({ 
            title, 
            slug, 
            content, 
            author: user._id, 
            category,
            coverImage 
        });

        await newPost.save();
        console.log("New Post Created:", newPost);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Error creating post" }, { status: 500 });
    }
}
