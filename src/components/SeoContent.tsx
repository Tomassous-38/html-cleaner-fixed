import React from 'react';

// Server-side rendered component
const SeoContent = () => {
  return (
    <div className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose lg:prose-lg mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">The Ultimate Google Docs to WordPress HTML Cleaner</h2>
            <p className="text-white/90 text-xl">
              Transform your Google Docs content into clean, WordPress-ready HTML instantly. Say goodbye to formatting issues and hello to perfect WordPress posts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-indigo-900 mb-4">Common Formatting Issues</h3>
              <ul className="space-y-2 text-indigo-800">
                <li>Unwanted inline styles</li>
                <li>Messy HTML code</li>
                <li>Broken layouts</li>
                <li>Font inconsistencies</li>
                <li>Spacing problems</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">Our Solution</h3>
              <ul className="space-y-2 text-green-800">
                <li>Clean, minimal HTML</li>
                <li>WordPress-compatible code</li>
                <li>Preserved formatting</li>
                <li>Instant results</li>
                <li>No registration needed</li>
              </ul>
            </div>
          </div>

          <h3>Why Clean Your HTML?</h3>
          <p>
            When copying content from Google Docs to WordPress, you often encounter unwanted formatting that can break your website's layout. Our tool removes unnecessary HTML tags, inline styles, and attributes while preserving the essential formatting you need.
          </p>

          <div className="bg-blue-50 rounded-xl p-8 my-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Perfect for Content Creators</h3>
            <p className="text-blue-800">
              Whether you're a blogger, content writer, or WordPress developer, our tool streamlines your workflow. Write in Google Docs, clean the HTML with our tool, and paste directly into WordPress. No more formatting headaches!
            </p>
          </div>

          <h3>How It Works</h3>
          <p>
            Our HTML cleaner uses advanced algorithms to strip out unnecessary formatting while preserving the structure and meaning of your content. It's specifically designed to work with WordPress, ensuring your content looks perfect on your website.
          </p>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 my-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="text-indigo-800">
                <li>Instant HTML cleaning</li>
                <li>WordPress-optimized output</li>
                <li>Preserves important formatting</li>
                <li>No account required</li>
              </ul>
              <ul className="text-indigo-800">
                <li>Free to use</li>
                <li>Mobile-friendly interface</li>
                <li>Copy specific sections</li>
                <li>Real-time preview</li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SeoContent;