import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Received Credentials:", credentials);
    
        await dbConnect();
        console.log("Connected to DB");
    
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
            console.log("User not found for email:", credentials.email);
            throw new Error("User not found");
        }
    
        console.log("Found user:", user);
    
        if (!user.password) {
            console.log("User password is missing in DB!");
            throw new Error("Password not set for this user");
        }
    
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }
    
        return { id: user._id, name: user.name, email: user.email };
    },
    
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" }, // Custom login page

  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
