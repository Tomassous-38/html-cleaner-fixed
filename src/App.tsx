import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { FileCode2, Eraser, Copy, CheckCircle2, Sparkles, ArrowRight, Check, Zap } from 'lucide-react';
import SsrTest from './components/SsrTest';

function App() {
  const [cleanedHtml, setCleanedHtml] = useState('');
  const [showHtmlView, setShowHtmlView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSections, setCopiedSections] = useState<{start: number, end: number}[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const cleanHtml = (html: string) => {
    let cleaned = html;
    
    // Store tables for preservation
    const tables: string[] = [];
    cleaned = cleaned.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, (match) => {
      // Clean table while preserving structure
      const cleanedTable = match
        .replace(/ class="[^"]*"/g, '')
        .replace(/ style="[^"]*"/g, '')
        .replace(/(<table[^>]*)>/i, '$1 class="wp-table">')
        .replace(/<td[^>]*>/g, '<td>')
        .replace(/<th[^>]*>/g, '<th>')
        .replace(/<tr[^>]*>/g, '<tr>')
        .replace(/<tbody[^>]*>/g, '<tbody>')
        .replace(/<thead[^>]*>/g, '<thead>');
      
      tables.push(cleanedTable);
      return `%%TABLE${tables.length - 1}%%`;
    });
    
    // Store links for preservation
    const links: string[] = [];
    cleaned = cleaned.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, (_, href, text) => {
      links.push(`<a href="${href}">${text}</a>`);
      return `%%LINK${links.length - 1}%%`;
    });
    
    cleaned = cleaned
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .replace(/ class="[^"]*"/g, '')
      .replace(/ style="[^"]*"/g, '')
      .replace(/<p[^>]*>/g, '<p>')
      .replace(/&nbsp;/g, ' ')
      .replace(/<strong>/g, '<b>')
      .replace(/<\/strong>/g, '</b>')
      .replace(/<h([1-6])[^>]*>(?:<b>|<strong>)?(.*?)(?:<\/b>|<\/strong>)?<\/h\1>/g, '<h$1>$2</h$1>')
      .replace(/\s+/g, ' ')
      .trim();

    // Restore tables
    tables.forEach((table, index) => {
      cleaned = cleaned.replace(`%%TABLE${index}%%`, table);
    });

    // Restore links
    links.forEach((link, index) => {
      cleaned = cleaned.replace(`%%LINK${index}%%`, link);
    });

    return cleaned;
  };

  const inputEditor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'wp-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const cleaned = cleanHtml(html);
      setCleanedHtml(cleaned);
      if (outputEditor) {
        outputEditor.commands.setContent(cleaned);
      }
      setCopiedSections([]);
    },
  });

  const outputEditor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'wp-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editable: false,
  });

  const updateIndicatorBar = (container: HTMLElement) => {
    if (!indicatorRef.current) return;

    const containerHeight = container.scrollHeight;
    const indicators = copiedSections.map(({ start, end }) => {
      const startPercent = (start / containerHeight) * 100;
      const height = ((end - start) / containerHeight) * 100;
      return `<div 
        class="absolute bg-green-500 w-full transition-all duration-300" 
        style="top: ${startPercent}%; height: ${height}%;">
      </div>`;
    });

    indicatorRef.current.innerHTML = indicators.join('');
  };

  const getSelectedHtml = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return null;

    const container = showHtmlView ? preRef.current : outputRef.current?.querySelector('.ProseMirror');
    if (!container) return null;

    const range = selection.getRangeAt(0);
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
      return null;
    }

    if (showHtmlView) {
      return selection.toString();
    } else {
      const div = document.createElement('div');
      div.appendChild(range.cloneContents());
      return cleanHtml(div.innerHTML);
    }
  };

  const copyFormattedText = (html: string) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '-9999px';
    container.style.clip = 'rect(0, 0, 0, 0)';
    container.innerHTML = html;
    document.body.appendChild(container);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy', err);
    }

    selection?.removeAllRanges();
    document.body.removeChild(container);
  };

  const handleCopy = useCallback((e?: ClipboardEvent) => {
    const selection = window.getSelection();
    const container = showHtmlView ? preRef.current : outputRef.current?.querySelector('.ProseMirror');
    
    if (!container) return;

    let htmlToCopy = cleanedHtml;
    const selectedHtml = getSelectedHtml();
    
    if (selectedHtml) {
      htmlToCopy = selectedHtml;
      
      const range = selection!.getRangeAt(0);
      const rects = range.getClientRects();
      if (rects.length > 0) {
        const containerRect = container.getBoundingClientRect();
        const startY = rects[0].top - containerRect.top + container.scrollTop;
        const endY = rects[rects.length - 1].bottom - containerRect.top + container.scrollTop;
        
        setCopiedSections(prev => [...prev, { start: startY, end: endY }]);
        updateIndicatorBar(container);
      }

      if (e) {
        e.preventDefault();
        copyFormattedText(htmlToCopy);
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cleanedHtml, showHtmlView]);

  const copyToClipboard = useCallback(() => {
    const selectedHtml = getSelectedHtml();
    const htmlToCopy = selectedHtml || cleanedHtml;
    
    copyFormattedText(htmlToCopy);
    handleCopy();
  }, [cleanedHtml, showHtmlView, handleCopy]);

  const clearContent = useCallback(() => {
    if (inputEditor) {
      inputEditor.commands.clearContent();
      if (outputEditor) {
        outputEditor.commands.clearContent();
      }
      setCleanedHtml('');
      setCopiedSections([]);
      if (indicatorRef.current) {
        indicatorRef.current.innerHTML = '';
      }
    }
  }, [inputEditor, outputEditor]);

  useEffect(() => {
    const container = showHtmlView ? preRef.current : outputRef.current?.querySelector('.ProseMirror');
    if (container) {
      updateIndicatorBar(container);
    }
  }, [showHtmlView, copiedSections]);

  useEffect(() => {
    const handleKeyboardCopy = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        const container = showHtmlView ? preRef.current : outputRef.current?.querySelector('.ProseMirror');
        if (!container) return;

        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          if (container.contains(range.startContainer) && container.contains(range.endContainer)) {
            handleCopy(e as unknown as ClipboardEvent);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardCopy);
    return () => document.removeEventListener('keydown', handleKeyboardCopy);
  }, [handleCopy, showHtmlView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section with Tool */}
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

          {/* Tool Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mb-48">
            {/* Input Editor */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Original Text</h2>
                  <button
                    onClick={clearContent}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Eraser size={16} />
                    Clear
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="editor-container prose max-w-none border border-gray-200 rounded-lg p-4 min-h-[400px] focus-within:border-indigo-500 transition-colors">
                  <EditorContent editor={inputEditor} className="h-full" />
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Clean Text
                    <span className="block text-sm font-normal text-white/80">
                      Select text to copy specific parts
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowHtmlView(!showHtmlView)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <FileCode2 size={16} />
                      {showHtmlView ? 'Text View' : 'HTML View'}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        copied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 relative">
                <div className="absolute right-4 top-6 bottom-6 w-2 bg-red-200 rounded-full overflow-hidden">
                  <div ref={indicatorRef} className="relative w-full h-full"></div>
                </div>
                {showHtmlView ? (
                  <pre 
                    ref={preRef}
                    className="bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap min-h-[400px] border border-gray-200 text-sm font-mono mr-4"
                  >
                    {cleanedHtml || 'Clean HTML will appear here...'}
                  </pre>
                ) : (
                  <div 
                    ref={outputRef}
                    className="prose max-w-none border border-gray-200 rounded-lg p-4 min-h-[400px] mr-4"
                  >
                    <EditorContent editor={outputEditor} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SSR Test Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48">
        <SsrTest />
      </div>

      {/* Features Section */}
      <div className="bg-white pt-24 pb-24">
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

      {/* How to Use Section */}
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

      {/* SEO Content Section */}
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

      {/* Footer */}
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
    </div>
  );
}

export default App;