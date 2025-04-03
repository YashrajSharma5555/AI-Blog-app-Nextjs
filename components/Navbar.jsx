"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-btn";
import { useRouter } from "next/navigation";
import { Menu, X, Home, PlusCircle, FileText, List, User } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-sky-400/30 dark:bg-gray-900/30 dark:text-white backdrop-blur-md sticky top-0 z-50">
            {/* Logo */}
            <div className="text-2xl font-mono">
                <Link href="/">Blogify</Link>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 font-medium ">
                <li>
                    <Link href="/" className="flex items-center gap-1 cursor-pointer">
                        <Home className="w-5 h-5" /> Home
                    </Link>
                </li>
                <li>
                    <Link href="/addblog" className="flex items-center gap-1 cursor-pointer">
                        <PlusCircle className="w-5 h-5" /> Add Blog
                    </Link>
                </li>
                <li>
                    <Link href="/blog" className="flex items-center gap-1 cursor-pointer">
                        <FileText className="w-5 h-5" /> Blogs
                    </Link>
                </li>
                <li>
                    <Link href="/categories" className="flex items-center gap-1 cursor-pointer">
                        <List className="w-5 h-5" /> Categories
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="flex items-center gap-1 cursor-pointer">
                        <User className="w-5 h-5" /> Profile
                    </Link>
                </li>
            </ul>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden focus:outline-none">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg rounded-b-lg md:hidden">
                    <ul className="flex flex-col items-center py-4 space-y-4 font-medium">
                        <li>
                            <Link href="/" onClick={toggleMenu} className="flex items-center gap-2">
                                <Home className="w-5 h-5" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/addblog" onClick={toggleMenu} className="flex items-center gap-2">
                                <PlusCircle className="w-5 h-5" /> Add Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" onClick={toggleMenu} className="flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" onClick={toggleMenu} className="flex items-center gap-2">
                                <List className="w-5 h-5" /> Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-2">
                                <User className="w-5 h-5" /> Profile
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Theme Toggle & Authentication */}
            <div className="flex items-center gap-4">
                <ModeToggle />

                {session ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-sky-200 dark:bg-gray-900 shadow-md">
                        <Link href="/profile" className="flex items-center gap-2">
                            {session.user.image && (
                                <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all hover:scale-105"
          />                            )}
                            <span className="hidden sm:block text-gray-800 dark:text-white">{session.user.name}</span>
                        </Link>
                        <Button variant="outline" className="dark:text-white text-black" onClick={() => signOut()}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button variant="outline" className="dark:text-white text-black">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" className="dark:text-white text-black">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
