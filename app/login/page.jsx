"use client"

import { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import {useRouter} from "next/navigation"
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await signIn("google", {callbackUrl:"/"});
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(result.error);
    }else{
        router.push('/')
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md dark:bg-gray-900">
        {session ? (
          <div className="text-center">
            <h2 className="text-2xl dark:text-black font-semibold mb-4">Welcome, {session.user.email}</h2>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center dark:text-white mb-6">Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleCredentialsLogin} className="mb-4">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium dark:text-white text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full dark:text-black px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium dark:text-white text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full dark:text-black px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Sign in 
              </button>
            </form>
            <button
  onClick={handleGoogleLogin}
  className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
>
  <FcGoogle className="text-xl mr-2" />
  Sign in with Google
</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
