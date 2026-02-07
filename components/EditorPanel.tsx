import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BLOCK_SNIPPETS } from '../constants';
import { BlockType } from '../types';
import { 
  Save, Eye, Copy, Check, 
  Heading1, Heading2, Type, Bold, Italic, 
  Code, Table, List, ListOrdered, CheckSquare, 
  Quote, Link as LinkIcon, Image as ImageIcon, Minus
} from 'lucide-react';

interface EditorPanelProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  title: string;
  setTitle: (t: string) => void;
}

interface BlockDef {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
}

const BLOCKS: BlockDef[] = [
  { type: 'h1', label: 'H1', icon: <Heading1 size={18} /> },
  { type: 'h2', label: 'H2', icon: <Heading2 size={18} /> },
  { type: 'text', label: 'Text', icon: <Type size={18} /> },
  { type: 'bold', label: 'Bold', icon: <Bold size={18} /> },
  { type: 'italic', label: 'Italic', icon: <Italic size={18} /> },
  { type: 'code-js', label: 'JS Code', icon: <div className="text-[10px] font-bold">JS</div> },
  { type: 'code-py', label: 'Py Code', icon: <div className="text-[10px] font-bold">PY</div> },
  { type: 'code-tsx', label: 'React', icon: <div className="text-[10px] font-bold">TSX</div> },
  { type: 'table', label: 'Table', icon: <Table size={18} /> },
  { type: 'ul', label: 'List', icon: <List size={18} /> },
  { type: 'ol', label: 'Ordered', icon: <ListOrdered size={18} /> },
  { type: 'check', label: 'Task', icon: <CheckSquare size={18} /> },
  { type: 'quote', label: 'Quote', icon: <Quote size={18} /> },
  { type: 'link', label: 'Link', icon: <LinkIcon size={18} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={18} /> },
  { type: 'separator', label: 'Line', icon: <Minus size={18} /> },
];

export const EditorPanel: React.FC<EditorPanelProps> = ({
  markdown,
  setMarkdown,
  title,
  setTitle
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertBlock = (type: string) => {
    const snippet = BLOCK_SNIPPETS[type];
    if (!snippet || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + snippet + text.substring(end);
    setMarkdown(newText);
    
    // Restore focus and cursor position after insertion
    setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + snippet.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', BLOCK_SNIPPETS[type]);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur shrink-0">
        <div className="flex items-center gap-4 flex-1">
            <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Document"
                className="bg-transparent text-gray-100 font-medium text-lg focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-2 py-1 w-full max-w-md"
            />
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                title="Copy Markdown"
            >
                {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
            </button>
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-gray-950 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Save size={16} />
                <span>Save</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Block Palette & Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-800 min-w-[350px]">
          
          {/* Block Palette */}
          <div className="bg-gray-900/80 border-b border-gray-800 p-3 shrink-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Drag & Drop Blocks</p>
            <div className="flex flex-wrap gap-2">
                {BLOCKS.map((block) => (
                    <div
                        key={block.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block.type)}
                        onClick={() => insertBlock(block.type)}
                        className="group flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-primary-500/50 rounded-md px-3 py-2 cursor-grab active:cursor-grabbing transition-all select-none"
                        title={`Insert ${block.label}`}
                    >
                        <span className="text-primary-400 group-hover:text-primary-300">{block.icon}</span>
                        <span className="text-xs text-gray-300 font-medium">{block.label}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="flex-1 bg-gray-950 relative">
             <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full bg-transparent p-6 font-mono text-sm text-gray-300 focus:outline-none resize-none leading-relaxed"
                placeholder="Drag blocks here or start typing..."
                spellCheck={false}
              />
          </div>
        </div>

        {/* Right Pane: Preview */}
        <div className="w-1/2 flex flex-col bg-gray-900 border-l border-gray-950">
           <div className="h-10 bg-gray-850 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                    <Eye size={14} />
                    <span>Preview</span>
               </div>
           </div>
           <div className="flex-1 overflow-y-auto p-8 markdown-body">
              {markdown ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                        )
                    }
                    }}
                >
                    {markdown}
                </ReactMarkdown>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                      <div className="p-4 rounded-full bg-gray-800/50">
                        <Code size={32} className="opacity-50"/>
                      </div>
                      <p>Drag blocks or type to see the preview.</p>
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
