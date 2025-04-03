import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/db";
import BlogPost from "@/models/BlogPost";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Fetch all blogs of the logged-in user
export async function GET(req) {
    try {
        await dbConnect();

        // Get user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Please login !" }, { status: 401 });
        }

        // Get user ID from MongoDB
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch blogs using user ID
        const userBlogs = await BlogPost.find({ author: user._id }).exec();

        return NextResponse.json(userBlogs, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ error: "Please upload blogs !" }, { status: 500 });
    }
}

// Delete a blog by ID (only if the logged-in user is the author)
export async function DELETE(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id } = await req.json(); // Get blog ID from request body

        // Find the blog and check if the logged-in user is the author
        const blog = await BlogPost.findOne({ _id: id, author: user._id });
        if (!blog) {
            return NextResponse.json({ error: "Blog not found or not authorized" }, { status: 404 });
        }

        await BlogPost.deleteOne({ _id: id });

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Error deleting blog" }, { status: 500 });
    }
}

// Update a blog by ID (only if the logged-in user is the author)
export async function PATCH(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id, title, content } = await req.json(); // Get blog ID & updated data

        // Find the blog and check if the logged-in user is the author
        const blog = await BlogPost.findOne({ _id: id, author: user._id });
        if (!blog) {
            return NextResponse.json({ error: "Blog not found or not authorized" }, { status: 404 });
        }

        // Update blog
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        await blog.save();

        return NextResponse.json({ message: "Blog updated successfully", blog }, { status: 200 });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: "Error updating blog" }, { status: 500 });
    }
}
