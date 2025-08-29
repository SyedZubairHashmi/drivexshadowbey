"use client";

import type React from "react";
import { Sidebar } from "./sidebar";
import { ProtectedRoute } from "../ProtectedRoute";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        {/* Sidebar (fixed) */}
        <div className="w-74 fixed top-0 left-0 h-screen bg-white shadow">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 overflow-auto p-2" style={{ paddingTop: '5px', paddingRight: '5px' }}>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
