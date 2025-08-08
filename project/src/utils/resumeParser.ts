/**
 * resumeParser.ts
 * Extracts plain text from PDF/DOCX/TXT and returns inferred skills using roleSkillsets.
 *
 * Optional dependencies:
 *   npm install pdfjs-dist mammoth
 *
 * If pdfjs-dist/mammoth aren't installed, the code falls back to reading file.text()
 * and extracting keywords from that text.
 */

import { roleSkillsets } from '../data/roleSkillsets';

// (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
//   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;


function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function parseResume(file: File): Promise<{ text: string; skills: string[] }> {
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (name.endsWith('.docx')) {
      return await parseDocx(file);
    } else {
      // plain txt or unknown: read text
      const txt = await file.text();
      const skills = extractSkillsFromText(txt);
      return { text: txt, skills };
    }
  } catch (err) {
    console.warn('parseResume fallback to plain text due to error:', err);
    const txt = await file.text();
    return { text: txt, skills: extractSkillsFromText(txt) };
  }
}

async function parsePDF(file: File): Promise<{ text: string; skills: string[] }> {
  const pdfjsLib = await import('pdfjs-dist');
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((s: any) => (s.str ? s.str : ''));
    fullText += strings.join(' ') + '\n';
  }

  const skills = extractSkillsFromText(fullText);
  return { text: fullText, skills };
}


async function parseDocx(file: File): Promise<{ text: string; skills: string[] }> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer });
  const text = res.value || '';
  const skills = extractSkillsFromText(text);
  return { text, skills };
}

function extractSkillsFromText(text: string): string[] {
  if (!text) return [];

  // Build set of known skill names from roleSkillsets
  const skillSet = new Set<string>();
  roleSkillsets.forEach(role => {
    role.skills.forEach(s => skillSet.add(s.name.toLowerCase()));
  });

  // Add a few common synonyms and multiword tokens
  const extra = [
    'machine learning',
    'data science',
    'deep learning',
    'natural language processing',
    'nlp',
    'react',
    'redux',
    'next.js',
    'node.js',
    'node',
    'express',
    'docker',
    'kubernetes',
    'aws',
    'azure',
    'gcp',
    'typescript',
    'javascript',
    'html',
    'css',
    'tailwind',
    'figma'
  ];
  extra.forEach(e => skillSet.add(e.toLowerCase()));

  const found: string[] = [];
  skillSet.forEach(skillName => {
    const pattern = new RegExp('\\b' + escapeRegExp(skillName) + '\\b', 'i');
    if (pattern.test(text)) {
      found.push(skillName);
    }
  });

  // Normalize capitalization using canonical names from roleSkillsets when possible
  const normalized: string[] = [];
  found.forEach(f => {
    let canonical: string | null = null;
    for (const role of roleSkillsets) {
      for (const s of role.skills) {
        if (s.name.toLowerCase() === f.toLowerCase()) {
          canonical = s.name;
          break;
        }
      }
      if (canonical) break;
    }
    normalized.push(canonical || capitalizeWords(f));
  });

  // unique & sorted
  return Array.from(new Set(normalized)).sort();
}

function capitalizeWords(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}
