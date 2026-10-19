/**
 * Best-effort PDF text extraction for MVP ingest.
 * AI integration can replace / enrich this with OCR later.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse is CJS; dynamic import for Next server route
    const pdfParse = (await import("pdf-parse")).default as (
      data: Buffer,
    ) => Promise<{ text: string }>;
    const parsed = await pdfParse(buffer);
    return (parsed.text || "").trim();
  } catch {
    return "";
  }
}
