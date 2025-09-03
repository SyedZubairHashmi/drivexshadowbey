import React from "react";

export default function TestNavbarPage() {
  return (
    <div className="min-h-screen">
      {/* Content to test scroll behavior */}
      <div className="pt-20">
        <div className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Navbar Test</h1>
            <p className="text-xl">This page tests the navbar functionality</p>
            <p className="text-lg mt-2">Scroll down to see navbar behavior</p>
          </div>
        </div>
        
        <div className="h-screen bg-white flex items-center justify-center">
          <div className="text-center text-gray-800">
            <h2 className="text-4xl font-bold mb-4">White Section</h2>
            <p className="text-xl">Navbar should be dark here</p>
          </div>
        </div>
        
        <div className="h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Dark Section</h2>
            <p className="text-xl">Navbar should be light here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
