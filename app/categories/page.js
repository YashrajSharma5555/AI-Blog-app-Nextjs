"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Hardcoded category images
const categoryImages = {
    Technology: "/tech.jpg",
    Lifestyle: "/lifestyle.jpg",
    Entertainment:"/entertainment.jpg",
    Travel: "/travel.jpg",
    Food: "/food.jpg",
    Business: "/business.jpg",
    Health: "/health.jpg",
    Sports: "/sports.jpg",
    Education: "/education.jpg",
    Science: "/science.jpg",
    Politics: "/politic.jpg",
    Finance: "/finance.jpg",
    Startups: "/startup.jpg",
    Programming:"/programming.jpg",
    "AI & Machine Learning": "/ai.jpg",
    Cybersecurity: "/cyber.jpg",
    Gaming:"/gaming.jpg",
    Others:"/others.jpg"
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/category"); // Replace with your actual API
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center dark:text-white mb-6">Explore Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <div 
                        key={category.id || index}  
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer 
                                   transition-all hover:shadow-xl hover:bg-sky-100 dark:hover:bg-gray-700 overflow-hidden"
                        onClick={() => router.push(`/categories/${category.slug}`)}
                    >
                        {/* Hardcoded Category Image */}
                        <Image
  src={categoryImages[category.name] || "/others.jpg"} 
  alt={category.name} 
  width={500}  // Adjust as needed
  height={160} // Corresponds to h-40 (40 * 4 = 160px in Tailwind)
  className="w-full h-40 object-cover"
/>

                        
                        {/* Category Info */}
                        <div className="p-5">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{category.name}</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                {category.description || "Explore related blogs"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
