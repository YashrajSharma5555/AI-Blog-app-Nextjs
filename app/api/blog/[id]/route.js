import dbConnect from "@/utils/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";

// GET Blog by ID
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const blog = await BlogPost.findById(params.id);
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching blog" }, { status: 500 });
    }
}

// UPDATE Blog
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { title, content } = await req.json();

        const updatedBlog = await BlogPost.findByIdAndUpdate(
            params.id,
            { title, content },
            { new: true }
        );

        if (!updatedBlog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        return NextResponse.json(updatedBlog);
    } catch (error) {
        return NextResponse.json({ error: "Error updating blog" }, { status: 500 });
    }
}
