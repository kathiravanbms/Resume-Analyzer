import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import * as mammoth from "mammoth/mammoth.browser";
import type { ExtractedResume } from "../types";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const ACCEPT_STRING = ".pdf,.docx,.txt,.md";

export function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return [".pdf", ".docx", ".txt", ".md"].some((ext) => name.endsWith(ext));
}

function clean(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdf(file: File): Promise<ExtractedResume> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" "),
    );
  }
  const text = clean(pages.join("\n"));
  if (text.replace(/\s/g, "").length < 40) {
    return {
      text,
      warning:
        "Little or no text could be read from this PDF. It may be scanned or image-based — paste the text instead for an accurate analysis.",
    };
  }
  return { text };
}

async function extractDocx(file: File): Promise<ExtractedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  const text = clean(value);
  return {
    text,
    warning: text ? undefined : "The document appeared to be empty.",
  };
}

export async function extractResume(file: File): Promise<ExtractedResume> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdf(file);
  if (name.endsWith(".docx")) return extractDocx(file);
  if (name.endsWith(".doc")) {
    throw new Error(
      "Legacy .doc files aren't supported. Save as .docx or PDF, or paste the text.",
    );
  }
  const text = clean(await file.text());
  if (!text) throw new Error("That file didn't contain any readable text.");
  return { text };
}
