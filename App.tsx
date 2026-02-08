import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorPanel } from './components/EditorPanel';
import { BlockEditorPanel } from './components/BlockEditorPanel';
import { DEFAULT_MARKDOWN } from './constants';
import { GeneratedDoc, ViewMode } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // Simple in-memory persistence for demo
  const [documents, setDocuments] = useState<GeneratedDoc[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  
  // App View State
  const [viewMode, setViewMode] = useState<ViewMode>('raw');

  // Current Editor State
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [title, setTitle] = useState<string>("Welcome to markFlash");

  // Initialize with a default doc if empty
  useEffect(() => {
    if (documents.length === 0) {
        const initialDoc: GeneratedDoc = {
            id: uuidv4(),
            title: "Welcome to markFlash",
            content: DEFAULT_MARKDOWN,
            lastModified: Date.now()
        };
        setDocuments([initialDoc]);
        setCurrentDocId(initialDoc.id);
    }
  }, []);

  // Update current doc when selection changes
  useEffect(() => {
    if (currentDocId) {
        const doc = documents.find(d => d.id === currentDocId);
        if (doc) {
            setMarkdown(doc.content);
            setTitle(doc.title);
        }
    }
  }, [currentDocId]);

  // Save changes to current doc state (debounced in a real app, direct here for simplicity)
  useEffect(() => {
    if (currentDocId) {
        setDocuments(prev => prev.map(d => {
            if (d.id === currentDocId) {
                return { ...d, content: markdown, title: title, lastModified: Date.now() };
            }
            return d;
        }));
    }
  }, [markdown, title]);

  const handleNewDoc = () => {
    const newDoc: GeneratedDoc = {
        id: uuidv4(),
        title: "Untitled Document",
        content: "",
        lastModified: Date.now()
    };
    setDocuments(prev => [newDoc, ...prev]);
    setCurrentDocId(newDoc.id);
    setMarkdown("");
    setTitle("Untitled Document");
    // Switch to visual mode for new docs usually better for beginners
    setViewMode('block'); 
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar 
        documents={documents}
        currentDocId={currentDocId}
        onSelectDoc={setCurrentDocId}
        onNewDoc={handleNewDoc}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {viewMode === 'raw' ? (
        <EditorPanel 
          markdown={markdown}
          setMarkdown={setMarkdown}
          title={title}
          setTitle={setTitle}
        />
      ) : (
        <BlockEditorPanel 
          markdown={markdown}
          setMarkdown={setMarkdown}
          title={title}
          setTitle={setTitle}
        />
      )}
    </div>
  );
};

export default App;