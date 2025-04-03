import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import BlogPost from "@/models/BlogPost";
import Category from "@/models/Category"; // Assuming you have a Category model

export async function GET(req, context) {
    try {
        await dbConnect();

        // Ensure params are awaited before usage
        const { params } = context;
        if (!params?.slug) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const { slug } = params; // ✅ Extract slug safely

        // Find the category by slug
        const category = await Category.findOne({ slug });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Fetch blogs using category ID
        const blogs = await BlogPost.find({ category: category._id }).select("title slug coverImage");

        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}
