import Head from 'next/head';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowToUse from '@/components/HowToUse';
import SeoContent from '@/components/SeoContent';
import Footer from '@/components/Footer';
import SsrTest from '@/components/SsrTest';
import SsrTestAdvanced from '@/components/SsrTestAdvanced';

// Main page component with both SSR and CSR elements
export default function Home() {
  return (
    <>
      <Head>
        <title>Google Docs to WordPress HTML Cleaner | Free Online Tool</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Hero Section with Tool - Hero handles client/server rendering internally */}
        <Hero />
        
        {/* SSR Test Components */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48">
          <SsrTest />
          <SsrTestAdvanced />
        </div>
        
        {/* These components are always server-rendered */}
        <Features />
        <HowToUse />
        <SeoContent />
        <Footer />
      </div>
    </>
  );
}

// This function runs on the server for SSR
export async function getStaticProps() {
  // You could fetch any data needed for the static parts here
  return {
    props: {},
    // Revalidate every 24 hours
    revalidate: 86400,
  };
}