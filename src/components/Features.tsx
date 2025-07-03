import React from 'react';
import { Zap, Check, Sparkles } from 'lucide-react';

// Server-side rendered component
const Features = () => {
  return (
    <div className="bg-white pt-56 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Use Our Tool?</h2>
          <p className="mt-4 text-lg text-gray-600">
            The easiest way to transfer content from Google Docs to WordPress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Cleaning</h3>
            <p className="text-gray-600">
              Clean your content in seconds. No more manual formatting or code editing required.
            </p>
          </div>

          <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">WordPress Ready</h3>
            <p className="text-gray-600">
              Get clean HTML that works perfectly with WordPress. No styling conflicts.
            </p>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Forever</h3>
            <p className="text-gray-600">
              No sign-up required. No hidden fees. Just paste your content and get clean HTML.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;