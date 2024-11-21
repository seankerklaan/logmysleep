import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      {children}
      <footer className="bg-white border-t border-gray-100 py-6 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Sleep Journal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;