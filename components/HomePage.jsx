"use client"
import Image from 'next/image';
import Blog from '@/app/blog/page'
import CategoriesPage from '@/app/categories/page';


export default function HomePage() {
    return (
      <main className="min-h-screen flex flex-col items-center dark:bg-black bg-sky-200 text-gray-800 p-6">
        {/* Hero Section */}
        
        {/* Heading and Subtext */}
        <h1 className="text-4xl font-bold dark:text-white">Welcome to Blogify ✍️</h1>
          <p className="text-2xl text-gray-600 font-bold  mt-2 dark:text-white">
            Start your Blogging journey today with Blogify !
          </p>
          <p className="text-lg text-gray-600 mt-2 dark:text-white">
            Discover insightful articles, tutorials, and stories from our community. 
          </p>
        
        <section className="w-full max-w-5xl text-center mt-2 ">
          {/* Illustration */}
          <Image
            src="/homePageImage.webp"
            alt="Illustration"
            width={1200}
            height={400}
            className="rounded-xl mx-auto shadow-lg"
          />
          
          
        </section>
  
        {/* Latest Blogs Section */}

        <section >


<Blog/>
        </section>


        <section>

<CategoriesPage/>
        </section>



        
      </main>
    );
}
