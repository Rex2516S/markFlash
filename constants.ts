// Using a generic ledger-like icon from flaticon
export const APP_ICON_URL = "https://cdn-icons-png.flaticon.com/512/7858/7858975.png"; 

export const DEFAULT_MARKDOWN = `# Welcome to markFlash

This is your low-code markdown workspace.

1.  **Drag & Drop** blocks from the palette above into this editor.
2.  **Edit** your content manually.
3.  **Preview** the result on the right.

### Example Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, markFlash!");
}
\`\`\`
`;

export const BLOCK_SNIPPETS: Record<string, string> = {
  h1: '# Heading 1\n',
  h2: '## Heading 2\n',
  h3: '### Heading 3\n',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n',
  bold: '**Bold Text**',
  italic: '*Italic Text*',
  'code-generic': '\n```\n// Your code here\n```\n',
  'code-js': '\n```javascript\nconsole.log("Hello World");\n```\n',
  'code-py': '\n```python\ndef main():\n    print("Hello World")\n```\n',
  'code-tsx': '\n```tsx\nimport React from "react";\n\nexport const Component = () => <div>Hello</div>;\n```\n',
  table: '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n',
  ul: '- Item 1\n- Item 2\n- Item 3\n',
  ol: '1. First item\n2. Second item\n3. Third item\n',
  check: '- [ ] Task 1\n- [x] Task 2\n',
  quote: '> This is a blockquote.\n',
  link: '[Link Text](https://example.com)',
  image: '![Alt Text](https://via.placeholder.com/150)',
  separator: '\n---\n'
};
