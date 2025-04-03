import bcrypt from "bcryptjs";
import User from "@/models/User"; // Import the User model
import dbConnect from "@/utils/db"; // Ensure database connection

export async function POST(req) {
    try {
        await dbConnect(); // Ensure DB connection

        const { email, otp, password, name } = await req.json();

        if (!email || !otp || !password || !name) {
            return Response.json({ message: "Email, OTP, password, and name are required" }, { status: 400 });
        }

        // Fetch the user from the database
        const user = await User.findOne({ email });
        if (!user || !user.otpHash) {
            return Response.json({ message: "OTP expired or invalid" }, { status: 400 });
        }

        console.log("Received OTP:", otp);
        console.log("Stored Hashed OTP:", user.otpHash);

        // Check if OTP is expired
        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            return Response.json({ message: "OTP has expired" }, { status: 400 });
        }

        // Verify OTP
        const isMatch = bcrypt.compareSync(otp, user.otpHash);
        console.log("OTP Match Status:", isMatch);

        if (!isMatch) {
            return Response.json({ message: "Incorrect OTP" }, { status: 400 });
        }

        // ✅ Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Update the user's name & password, and clear OTP fields
        user.password = hashedPassword;
        user.name = name;
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;

        await user.save(); // Save updated user

        return Response.json({ message: "Name and password updated successfully", success: true }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
