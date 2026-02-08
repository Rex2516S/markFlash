import { Block, BlockType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseMarkdownToBlocks = (markdown: string): Block[] => {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const blocks: Block[] = [];
  let currentCodeBlock: Block | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (currentCodeBlock) {
      if (line.trim().startsWith('```')) {
        blocks.push(currentCodeBlock);
        currentCodeBlock = null;
      } else {
        currentCodeBlock.content += (currentCodeBlock.content ? '\n' : '') + line;
      }
      continue;
    }
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace('```', '');
      const type = lang === 'javascript' || lang === 'js' ? 'code-js' 
                 : lang === 'python' || lang === 'py' ? 'code-py'
                 : lang === 'tsx' || lang === 'react' ? 'code-tsx'
                 : 'code-generic';
      currentCodeBlock = { id: uuidv4(), type: type as BlockType, content: '' };
      continue;
    }

    // Handle Headers
    if (line.startsWith('# ')) {
      blocks.push({ id: uuidv4(), type: 'h1', content: line.substring(2) });
    } else if (line.startsWith('## ')) {
      blocks.push({ id: uuidv4(), type: 'h2', content: line.substring(3) });
    } else if (line.startsWith('### ')) {
      blocks.push({ id: uuidv4(), type: 'h3', content: line.substring(4) });
    } 
    // Handle Separator
    else if (line.trim() === '---' || line.trim() === '***') {
      blocks.push({ id: uuidv4(), type: 'separator', content: '' });
    }
    // Handle Blockquotes
    else if (line.startsWith('> ')) {
       blocks.push({ id: uuidv4(), type: 'quote', content: line.substring(2) });
    }
    // Lists (simplified - handling single lines as blocks for now)
    else if (line.trim().startsWith('- ')) {
       blocks.push({ id: uuidv4(), type: 'ul', content: line.trim().substring(2) });
    }
    // Handle Images (![Alt](url))
    else if (line.match(/^!\[(.*?)\]\((.*?)\)$/)) {
        // Keeping raw markdown for simplicity in this MVP
        blocks.push({ id: uuidv4(), type: 'image', content: line });
    }
    // Fallback Paragraph (skip empty lines between blocks mostly, but keep them if they matter?)
    // For this block editor, we generally want to compact empty lines unless explicit.
    else if (line.trim().length > 0) {
      blocks.push({ id: uuidv4(), type: 'text', content: line });
    }
  }
  
  if (currentCodeBlock) {
      blocks.push(currentCodeBlock);
  }

  return blocks;
};

export const blocksToMarkdown = (blocks: Block[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'h1': return `# ${block.content}`;
      case 'h2': return `## ${block.content}`;
      case 'h3': return `### ${block.content}`;
      case 'code-js': return `\`\`\`javascript\n${block.content}\n\`\`\``;
      case 'code-py': return `\`\`\`python\n${block.content}\n\`\`\``;
      case 'code-tsx': return `\`\`\`tsx\n${block.content}\n\`\`\``;
      case 'code-generic': return `\`\`\`\n${block.content}\n\`\`\``;
      case 'quote': return `> ${block.content}`;
      case 'ul': return `- ${block.content}`;
      case 'separator': return `---`;
      case 'image': return block.content; 
      default: return block.content;
    }
  }).join('\n\n');
};