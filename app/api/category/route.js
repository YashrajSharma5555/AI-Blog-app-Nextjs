import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Category from "@/models/Category";

// Handle GET request
export async function GET() {
  try {
    await dbConnect(); // Ensure database connection
    const categories = await Category.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Handle POST request
// export async function POST(req) {
//   try {
//     await dbConnect(); // Ensure database connection
//     const body = await req.json(); // Parse request body
//     const { name, slug } = body;

//     if (!name || !slug) {
//       return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
//     }

//     const newCategory = new Category({ name, slug });
//     await newCategory.save();

//     return NextResponse.json(newCategory, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
//   }
// }

