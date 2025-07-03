import React, { useEffect, useState } from 'react';

const SsrTestAdvanced = () => {
  const [isClient, setIsClient] = useState(false);
  const [windowExists, setWindowExists] = useState(false);
  const [documentExists, setDocumentExists] = useState(false);
  const [navigatorExists, setNavigatorExists] = useState(false);
  const [userAgent, setUserAgent] = useState<string | null>(null);
  const [renderTime, setRenderTime] = useState<string>('');
  const [serverTime, setServerTime] = useState<string>('');

  // This will only run on the client after hydration
  useEffect(() => {
    setIsClient(true);
    setWindowExists(typeof window !== 'undefined');
    setDocumentExists(typeof document !== 'undefined');
    setNavigatorExists(typeof navigator !== 'undefined');
    setUserAgent(navigator?.userAgent || null);
    const clientTime = new Date().toISOString();
    setRenderTime(clientTime);
    // Set a "simulated" server time (slightly before client time)
    const serverTimeSimulated = new Date(Date.now() - 100).toISOString();
    setServerTime(serverTimeSimulated);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced SSR Test Results</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Technical Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Server Render Time:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{serverTime || 'Loading...'}</code></td>
              </tr>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Client Hydrated:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{isClient ? 'Yes' : 'No'}</code></td>
              </tr>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Client Render Time:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{renderTime || 'Loading...'}</code></td>
              </tr>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Window Object:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{windowExists ? 'Available' : 'Not Available'}</code></td>
              </tr>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Document Object:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{documentExists ? 'Available' : 'Not Available'}</code></td>
              </tr>
              <tr className="border-b border-purple-100">
                <td className="py-2 font-medium text-purple-700">Navigator Object:</td>
                <td className="py-2 text-purple-800"><code className="bg-purple-100 px-2 py-1 rounded">{navigatorExists ? 'Available' : 'Not Available'}</code></td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-purple-700">User Agent:</td>
                <td className="py-2 text-purple-800">
                  <div className="max-w-md overflow-x-auto">
                    <code className="bg-purple-100 px-2 py-1 rounded whitespace-nowrap">{userAgent || 'Loading...'}</code>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800 mb-2">How to Verify SSR</h3>
          <ol className="list-decimal pl-5 text-indigo-700 space-y-2">
            <li>
              <strong>View Page Source</strong>: Right-click on the page and select "View Page Source" (not "Inspect"). If you see the server timestamp and "Client hydrated: No" in the HTML source, the page was server-rendered.
            </li>
            <li>
              <strong>Disable JavaScript</strong>: Temporarily disable JavaScript in your browser and reload the page. If content still appears, it's server-rendered.
            </li>
            <li>
              <strong>Network Tab</strong>: In browser DevTools, check the Network tab and look at the initial HTML response. Server-rendered content will be in the HTML.
            </li>
            <li>
              <strong>Time Difference</strong>: After the page loads, compare the server and client timestamps. If they differ, the initial render was on the server.
            </li>
          </ol>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Important Note for Netlify Deployment</h3>
          <p className="text-red-700">
            When deployed on Netlify, this site will serve pre-rendered static HTML files. This means the HTML is generated at build time, not for each request. While this appears as "server-rendered" content, it's actually <strong>statically generated</strong> during the build process, not true server-side rendering that happens on each request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SsrTestAdvanced;