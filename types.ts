export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedDoc {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export type BlockType = 
  | 'h1' | 'h2' | 'h3' 
  | 'text' | 'bold' | 'italic'
  | 'code-js' | 'code-py' | 'code-tsx' | 'code-generic'
  | 'table' | 'ul' | 'ol' | 'check'
  | 'quote' | 'link' | 'image' | 'separator';

export interface GenerationParams {
  docType: string;
  topic: string;
  context: string;
  tone: string;
  sections: string[];
  includeTableOfContents: boolean;
  includeCode: boolean;
}