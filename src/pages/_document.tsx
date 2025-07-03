import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Free online tool to clean and convert Google Docs content to WordPress-ready HTML. Remove unnecessary formatting and paste directly into WordPress without issues." />
        <meta name="keywords" content="google docs to wordpress, clean html, wordpress formatting, google docs converter" />
        <meta property="og:title" content="Google Docs to WordPress HTML Cleaner" />
        <meta property="og:description" content="Free online tool to clean and convert Google Docs content to WordPress-ready HTML. Remove unnecessary formatting and paste directly into WordPress without issues." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Google Docs to WordPress HTML Cleaner" />
        <meta name="twitter:description" content="Free online tool to clean and convert Google Docs content to WordPress-ready HTML" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}