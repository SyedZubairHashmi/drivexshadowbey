"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to appropriate dashboard based on role if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'company') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        console.log('Login successful, user data:', data.data);
        // Use the auth hook to login
        login(data.data, rememberMe);
        
        // Wait a moment for the auth state to update, then navigate
        setTimeout(() => {
          console.log('About to navigate after login');
          
          // Debug: Check if cookies are set
          console.log('Current cookies:', document.cookie);
          
          if (data.data.role === 'admin') {
            console.log('Redirecting to admin dashboard');
            router.replace('/admin');
          } else if (data.data.role === 'company') {
            console.log('Redirecting to company dashboard');
            router.replace('/dashboard');
          } else {
            console.log('Redirecting to fallback dashboard');
            router.replace('/dashboard'); // fallback
          }
        }, 100);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black p-2">
      
      {/* White form card */}
      <div className="w-full md:w-[60%] bg-white flex items-center justify-center rounded-xl">
        <div className="w-4/5 md:w-3/5 flex flex-col justify-center py-10">
          {/* Welcome message */}
          <div className="pb-6 text-left">
            <h1 className="text-3xl font-bold text-black mb-2">Welcome!</h1>
            <p className="text-black-400">
              Please login to access System Administrator Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-black-400">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-black-400">
                Password/PIN
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your password or PIN"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-400 rounded focus:ring-green-700"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-black-600">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-900 hover:bg-green-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-3xl transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right visual area (image on desktop) */}
      <div className="hidden md:block w-[40%] relative rounded-xl overflow-hidden">
        <Image
          src="/shadowbey.png"
          alt="Login visual"
          fill
          priority
          sizes="(min-width: 768px) 40vw, 0vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}