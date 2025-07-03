import React from 'react';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import the HtmlCleaner component with no SSR since it uses browser APIs
const HtmlCleaner = dynamic(() => import('./HtmlCleaner'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mb-48">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Original Text</h2>
            <div className="px-4 py-2 bg-white/10 text-white rounded-lg">
              Clear
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="prose max-w-none border border-gray-200 rounded-lg p-4 min-h-[400px]">
            <p className="text-gray-400">Loading editor...</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Clean Text
            </h2>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-white/10 text-white rounded-lg">
                HTML View
              </div>
              <div className="px-4 py-2 bg-white text-green-600 rounded-lg">
                Copy All
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="prose max-w-none border border-gray-200 rounded-lg p-4 min-h-[400px]">
            <p className="text-gray-400">Paste content in the editor to see results...</p>
          </div>
        </div>
      </div>
    </div>
  )
});

// This component combines server-rendered content with client-side interactive elements
const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Google Docs to WordPress
            </h1>
          </div>
          <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto text-indigo-100">
            Clean and convert your Google Docs content into WordPress-ready HTML instantly. No more formatting issues!
          </p>
        </div>

        {/* Tool Section - Dynamic import handles SSR/CSR automatically */}
        <HtmlCleaner />
      </div>
    </div>
  );
};

export default Hero;