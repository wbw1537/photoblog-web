import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen">
      {/* Left section (66.6%) - Empty for now, will contain logo and text later */}
      <div className="w-2/3 bg-gray-50 flex items-center justify-center">
        <div className="p-12">
          {/* Placeholder for future content */}
          <h2 className="text-3xl font-bold text-gray-800">Welcome to PhotoBlog</h2>
          <p className="mt-4 text-gray-600">Share your moments with the world</p>
        </div>
      </div>
      
      {/* Vertical divider */}
      <div className="border-l border-gray-200"></div>
      
      {/* Right section (33.3%) - Auth form */}
      <div className="w-1/3 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;