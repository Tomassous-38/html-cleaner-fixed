import React from 'react';

// Server-side rendered component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400">
            Free Online Tool for WordPress Content Creators
          </p>
          <p className="mt-4 text-sm text-gray-500">
            © {new Date().getFullYear()} HTML Cleaner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;