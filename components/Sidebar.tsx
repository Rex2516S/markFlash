import React from 'react';
import { APP_ICON_URL } from '../constants';
import { GeneratedDoc, ViewMode } from '../types';
import { Plus, FileText, Settings, Github, Layout, Code } from 'lucide-react';

interface SidebarProps {
  documents: GeneratedDoc[];
  currentDocId: string | null;
  onSelectDoc: (id: string) => void;
  onNewDoc: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  documents, 
  currentDocId, 
  onSelectDoc, 
  onNewDoc,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img src={APP_ICON_URL} alt="markFlash" className="w-8 h-8 opacity-90" />
        <span className="font-semibold text-lg tracking-tight text-gray-100">markFlash</span>
      </div>

      <div className="p-3">
        <button
          onClick={onNewDoc}
          className="w-full flex items-center gap-2 bg-gray-800 hover:bg-gray-750 text-blue-300 px-4 py-3 rounded-full transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          <span>New Document</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-2">
          Recent
        </div>
        {documents.length === 0 && (
          <div className="text-gray-600 text-sm px-4 py-2 italic">No documents yet.</div>
        )}
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectDoc(doc.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition-all ${
              currentDocId === doc.id
                ? 'bg-primary-500/20 text-primary-400 font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <FileText size={14} className="flex-shrink-0" />
            <span className="truncate">{doc.title || 'Untitled Doc'}</span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-800 space-y-2">
        <div className="bg-gray-900 rounded-lg p-1 flex">
          <button 
            onClick={() => setViewMode('raw')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded transition-all ${viewMode === 'raw' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Code size={14} /> Raw
          </button>
          <button 
             onClick={() => setViewMode('block')}
             className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded transition-all ${viewMode === 'block' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Layout size={14} /> Visual
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg text-sm transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg text-sm transition-colors">
          <Github size={16} />
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
};