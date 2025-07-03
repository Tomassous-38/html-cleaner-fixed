import React from 'react';
import { FileCode2 } from 'lucide-react';

// Server-side rendered component
const HowToUse = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <FileCode2 className="w-8 h-8 text-indigo-500" />
              How to Use Our Tool
            </h3>
            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-lg font-semibold">1</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Copy from Google Docs</h4>
                  <p className="text-gray-600">Select and copy your content directly from your Google Docs document</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-lg font-semibold">2</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Paste in the Editor</h4>
                  <p className="text-gray-600">Paste your content into the left editor panel</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-lg font-semibold">3</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Get Clean HTML</h4>
                  <p className="text-gray-600">Your cleaned content appears instantly in the right panel</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-lg font-semibold">4</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Copy to WordPress</h4>
                  <p className="text-gray-600">Copy the cleaned HTML and paste it directly into your WordPress editor</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;