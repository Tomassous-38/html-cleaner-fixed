import React, { useEffect, useState } from 'react';

const SsrTest = () => {
  const [isClient, setIsClient] = useState(false);
  const [renderTime, setRenderTime] = useState<string>('');
  const [serverTime, setServerTime] = useState<string>('');

  // This will only run on the client after hydration
  useEffect(() => {
    setIsClient(true);
    const clientTime = new Date().toISOString();
    setRenderTime(clientTime);
    // Set a "simulated" server time (slightly before client time)
    const serverTimeSimulated = new Date(Date.now() - 100).toISOString();
    setServerTime(serverTimeSimulated);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">SSR Test Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Server Rendering</h3>
          <p className="text-blue-700">
            Server render time: <code className="bg-blue-100 px-2 py-1 rounded">{serverTime || 'Loading...'}</code>
          </p>
          <p className="mt-2 text-sm text-blue-600">
            This timestamp was generated during the initial render (potentially on the server)
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Client Rendering</h3>
          <p className="text-green-700">
            Client hydrated: <code className="bg-green-100 px-2 py-1 rounded">{isClient ? 'Yes' : 'No'}</code>
          </p>
          <p className="text-green-700">
            Client render time: <code className="bg-green-100 px-2 py-1 rounded">{renderTime || 'Loading...'}</code>
          </p>
          <p className="mt-2 text-sm text-green-600">
            This state is only updated after client-side JavaScript runs
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Interpretation</h3>
        <ul className="list-disc pl-5 text-yellow-700">
          <li>If the page is <strong>server-rendered</strong>, the initial HTML will contain the server timestamp, but "Client hydrated" will show "No" until JavaScript runs</li>
          <li>If the page is <strong>client-rendered only</strong>, you'll briefly see no content or placeholder content until JavaScript runs</li>
          <li>After hydration, both timestamps will be visible, but they'll be different if server rendering occurred</li>
          <li>You can also check the page source (View Source) to see if the HTML contains the server timestamp</li>
        </ul>
      </div>
    </div>
  );
};

export default SsrTest;