import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Block, BlockType } from '../types';
import { parseMarkdownToBlocks, blocksToMarkdown } from '../utils/blockUtils';
import { v4 as uuidv4 } from 'uuid';
import { 
  Heading1, Heading2, Heading3, Type, Quote, Code, Image as ImageIcon, 
  List, Minus, GripVertical, Trash2, ArrowUp, ArrowDown, Eye, Code2, Edit3, Save
} from 'lucide-react';

interface BlockEditorPanelProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  title: string;
  setTitle: (t: string) => void;
}

type Tab = 'edit' | 'preview' | 'code';

const PALETTE_ITEMS: { type: BlockType; label: string; icon: React.ReactNode; category: string }[] = [
  { type: 'h1', label: 'Heading 1', icon: <Heading1 size={16} />, category: 'Structure' },
  { type: 'h2', label: 'Heading 2', icon: <Heading2 size={16} />, category: 'Structure' },
  { type: 'h3', label: 'Heading 3', icon: <Heading3 size={16} />, category: 'Structure' },
  { type: 'text', label: 'Paragraph', icon: <Type size={16} />, category: 'Structure' },
  { type: 'image', label: 'Image', icon: <ImageIcon size={16} />, category: 'Media & Code' },
  { type: 'code-generic', label: 'Code Block', icon: <Code size={16} />, category: 'Media & Code' },
  { type: 'quote', label: 'Blockquote', icon: <Quote size={16} />, category: 'Media & Code' },
  { type: 'ul', label: 'Bullet List', icon: <List size={16} />, category: 'Lists' },
  { type: 'separator', label: 'Divider', icon: <Minus size={16} />, category: 'Lists' },
];

export const BlockEditorPanel: React.FC<BlockEditorPanelProps> = ({
  markdown,
  setMarkdown,
  title,
  setTitle
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  
  // Initial sync
  useEffect(() => {
    setBlocks(parseMarkdownToBlocks(markdown));
  }, []); // Only on mount to avoid cursor jumping if we were to sync on every markdown change

  // Sync back to markdown when blocks change
  useEffect(() => {
    const newMarkdown = blocksToMarkdown(blocks);
    if (newMarkdown !== markdown) {
      setMarkdown(newMarkdown);
    }
  }, [blocks]);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: type === 'image' ? '![Alt text](https://via.placeholder.com/150)' : ''
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setBlocks(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('blockType') as BlockType;
    if (type) {
      handleAddBlock(type);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const categories = Array.from(new Set(PALETTE_ITEMS.map(i => i.category)));

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur shrink-0">
         <div className="flex-1">
             <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Document"
                className="bg-transparent text-gray-100 font-medium text-lg focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-2 py-1 w-full max-w-md"
            />
         </div>
         <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'edit' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Edit3 size={14} /> Edit
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Eye size={14} /> Preview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Code2 size={14} /> Code
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Palette (Only in Edit Mode) */}
        {activeTab === 'edit' && (
          <div className="w-64 bg-gray-900/50 border-r border-gray-800 p-4 flex flex-col gap-6 overflow-y-auto">
             {categories.map(cat => (
               <div key={cat}>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{cat}</h3>
                 <div className="space-y-2">
                   {PALETTE_ITEMS.filter(i => i.category === cat).map(item => (
                     <div 
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        onClick={() => handleAddBlock(item.type)}
                        className="flex items-center gap-3 p-2 bg-gray-800 border border-gray-700 rounded cursor-grab active:cursor-grabbing hover:border-primary-500/50 hover:bg-gray-750 transition-all group"
                     >
                        <span className="text-gray-400 group-hover:text-primary-400">{item.icon}</span>
                        <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Main Canvas / Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gray-950 p-8 relative"
             onDrop={activeTab === 'edit' ? handleDrop : undefined}
             onDragOver={activeTab === 'edit' ? handleDragOver : undefined}
        >
           {/* Edit Mode */}
           {activeTab === 'edit' && (
             <div className="max-w-3xl mx-auto space-y-4 pb-20">
                {blocks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-800 rounded-xl p-12 text-center text-gray-500">
                    <p className="mb-2">Your document is empty.</p>
                    <p className="text-sm">Drag blocks from the left or click them to add content.</p>
                  </div>
                )}

                {blocks.map((block, index) => (
                  <div key={block.id} className="group relative bg-gray-900 border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700">
                     <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-r border-gray-800 bg-gray-850 rounded-l-lg cursor-grab active:cursor-grabbing text-gray-500">
                        <GripVertical size={16} />
                     </div>
                     
                     <div className="pl-6 pr-8">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">
                            {PALETTE_ITEMS.find(i => i.type === block.type)?.label || block.type}
                          </span>
                       </div>
                       
                       {block.type.startsWith('code') ? (
                         <textarea
                            value={block.content}
                            onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                            className="w-full bg-gray-950 font-mono text-sm text-gray-300 p-3 rounded border border-gray-800 focus:outline-none focus:border-primary-500"
                            rows={4}
                            placeholder="Enter code..."
                         />
                       ) : block.type === 'separator' ? (
                          <hr className="border-gray-700 my-2" />
                       ) : (
                         <textarea
                            value={block.content}
                            onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                            className={`w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden
                              ${block.type === 'h1' ? 'text-2xl font-bold' : 
                                block.type === 'h2' ? 'text-xl font-bold' :
                                block.type === 'h3' ? 'text-lg font-bold' :
                                block.type === 'quote' ? 'text-gray-400 italic pl-2 border-l-2 border-gray-600' :
                                'text-base'}`}
                            rows={1}
                            placeholder={`Type / to browse or start writing...`}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                            // Initial height adjustment
                            ref={el => { if(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                         />
                       )}
                     </div>

                     <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteBlock(block.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded"><Trash2 size={14}/></button>
                        <button onClick={() => handleMoveBlock(index, -1)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded"><ArrowUp size={14}/></button>
                        <button onClick={() => handleMoveBlock(index, 1)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded"><ArrowDown size={14}/></button>
                     </div>
                  </div>
                ))}
             </div>
           )}

           {/* Preview Mode */}
           {activeTab === 'preview' && (
             <div className="max-w-4xl mx-auto markdown-body">
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
             </div>
           )}

           {/* Code Mode */}
           {activeTab === 'code' && (
             <div className="max-w-4xl mx-auto">
               <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono text-sm overflow-auto whitespace-pre-wrap">
                 {markdown}
               </pre>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};