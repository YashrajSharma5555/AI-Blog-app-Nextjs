/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com", // ✅ Add Google profile picture domain
    ],
  },
};

export default nextConfig;