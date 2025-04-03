import dbConnect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Login route (POST /api/users/login)
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json(); // Correct way to parse body
    const { email, password } = body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials!" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials!" }, { status: 401 });
    }

    // Respond with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

