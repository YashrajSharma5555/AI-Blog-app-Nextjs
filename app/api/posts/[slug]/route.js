import dbConnect from "@/utils/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    await dbConnect();

    const { params } = context; // ✅ Extract params properly
    if (!params?.slug) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
        const post = await BlogPost.findOne({ slug: params.slug })
            .populate("author", "name") // Get author's name
            .populate("category", "name") // Get category name
            .exec();

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
    }
}
