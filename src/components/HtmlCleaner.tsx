'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { FileCode2, Eraser, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

// This component is client-side only
const HtmlCleaner = () => {
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
    
    // Clean HTML while preserving intentional formatting
    cleaned = cleaned
      // Remove empty spans and spans with only whitespace
      .replace(/<span[^>]*>(\s*)<\/span>/g, '$1')
      // Remove spans but keep their content
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      // Remove font tags but keep content
      .replace(/<font[^>]*>/g, '')
      .replace(/<\/font>/g, '')
      // Remove all classes and styles
      .replace(/ class="[^"]*"/g, '')
      .replace(/ style="[^"]*"/g, '')
      // Remove other attributes like id, data-*, etc.
      .replace(/ id="[^"]*"/g, '')
      .replace(/ data-[^=]*="[^"]*"/g, '')
      // Clean paragraphs
      .replace(/<p[^>]*>/g, '<p>')
      // Convert strong to b
      .replace(/<strong>/g, '<b>')
      .replace(/<\/strong>/g, '</b>')
      // Convert em to i
      .replace(/<em>/g, '<i>')
      .replace(/<\/em>/g, '</i>')
      // Clean headings - remove formatting tags inside them
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, content) => {
        // Remove all formatting tags inside headings
        const cleanContent = content
          .replace(/<b>/g, '')
          .replace(/<\/b>/g, '')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
          .replace(/<i>/g, '')
          .replace(/<\/i>/g, '')
          .replace(/<em>/g, '')
          .replace(/<\/em>/g, '')
          .replace(/<u>/g, '')
          .replace(/<\/u>/g, '')
          .replace(/<span[^>]*>/g, '')
          .replace(/<\/span>/g, '')
          .trim();
        return `<h${level}>${cleanContent}</h${level}>`;
      })
      // Clean up whitespace
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      // Remove empty tags
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<b>\s*<\/b>/g, '')
      .replace(/<i>\s*<\/i>/g, '')
      .replace(/<u>\s*<\/u>/g, '')
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
    immediatelyRender: false,
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
    immediatelyRender: false,
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
        updateIndicatorBar(container as HTMLElement);
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
      updateIndicatorBar(container as HTMLElement);
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
  );
};

export default HtmlCleaner;