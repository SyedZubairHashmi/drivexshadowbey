"use client";

import React from "react";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area - flex-1 makes it take remaining space */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}
