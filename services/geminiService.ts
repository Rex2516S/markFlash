import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from '../types';

export const generateMarkdown = async (params: GenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert technical writer and developer.
    Generate a ${params.docType} in Markdown format.
    
    Topic: ${params.topic}
    Context/Description: ${params.context}
    Tone: ${params.tone}
    
    Required Sections:
    ${params.sections.map(s => `- ${s}`).join('\n')}
    
    Requirements:
    ${params.includeTableOfContents ? '- Include a Table of Contents at the top.' : ''}
    ${params.includeCode ? '- Include relevant code examples in code blocks.' : ''}
    - Ensure the markdown is valid and well-structured.
    - Use appropriate headings (H1 for title, H2/H3 for subsections).
    - Do not include any conversational filler (e.g. "Here is your markdown"). Just output the raw Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating markdown:", error);
    throw error;
  }
};