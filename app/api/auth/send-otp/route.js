import { Resend } from "resend";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect  from "@/utils/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    await dbConnect(); // Ensure database connection before running queries

    try {
        const { email } = await req.json();
        if (!email) return Response.json({ message: "Email is required" }, { status: 400 });

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const hashedOtp = bcrypt.hashSync(otp, 10);

        // Update OTP in the database
        const user = await User.findOneAndUpdate(
            { email },
            { otpHash: hashedOtp, otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) }, // 5-minute expiry
            { new: true, upsert: true }
        );

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 400 });
        }

        // Send OTP via email
        await resend.emails.send({
            from: `BlogApp <${process.env.EMAIL_FROM}>`,
            to: [email],
            subject: "Your OTP Code",
            html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });

        console.log("Generated OTP:", otp);
        console.log("Hashed OTP Stored:", hashedOtp);

        return Response.json({ message: "OTP sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return Response.json({ message: "Failed to send OTP", error: error.message }, { status: 500 });
    }
}
