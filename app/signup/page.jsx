"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", otp: "", password: "" });
    const [step, setStep] = useState(1); // Step 1: Enter Email | Step 2: Enter OTP & Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Send OTP to user's email
    const sendOTP = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("OTP sent to your email!");
                setStep(2); // Move to OTP step
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and complete signup
    const verifyAndSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("Registration successful! ");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.error || "Failed to verify OTP.");
            }
        } catch (err) {
            setError("Verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (err) {
            setError("Google sign-in failed. Try again.");
        }
    };

    return (
<div className="flex items-center justify-center min-h-screen">
  <div className="flex flex-col justify-center items-center max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
    {/* Content Here */}            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Sign Up</h2>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}

            {step === 1 ? (
                // Step 1: Enter Name & Email
                <div className="space-y-4 mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        className="border p-2 w-full dark:text-white"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="border p-2 w-full dark:text-white"
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={sendOTP}
                        className="bg-blue-500 text-white p-2 w-full"
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </div>
            ) : (
                // Step 2: Enter OTP & Password
                <form onSubmit={verifyAndSignup} className="space-y-4 mt-4">
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        required
                        className="border p-2 w-full dark:text-white"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Create Password"
                        required
                        className="border p-2 w-full dark:text-white"
                        onChange={handleChange}
                    />
                    <button type="submit" className="bg-green-500 text-white p-2 w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify & Sign Up"}
                    </button>
                </form>
            )}

            <div className="mt-4 text-center dark:text-white">
                <p>Or</p>
                <button
  onClick={handleGoogleSignIn}
  className="flex items-center mt-2 justify-center w-full py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
>
  <FcGoogle className="text-xl mr-2" />
  Sign in with Google
</button>
            </div>

            <p className="mt-4 text-center dark:text-white">
                Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
</div>
    );
}
