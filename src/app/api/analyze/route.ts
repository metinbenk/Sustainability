import { NextRequest, NextResponse } from "next/server";
import { runAnalysis } from "@/lib/ai/analyze";
import { extractPdfText } from "@/lib/pdf/extract";
import type { AnalysisMode, RunKind } from "@/lib/esrs/types";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per file

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const companyName = String(form.get("companyName") || "").trim();
    const freeText = String(form.get("freeText") || "");
    const mode = (String(form.get("mode") || "fixture") as AnalysisMode) || "fixture";
    const runKind = (String(form.get("runKind") || "analiz") as RunKind) || "analiz";

    if (!companyName) {
      return NextResponse.json({ error: "Firma adı gerekli." }, { status: 400 });
    }

    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `En fazla ${MAX_FILES} PDF yüklenebilir.` },
        { status: 400 },
      );
    }

    const texts: string[] = [];
    const fileNames: string[] = [];

    for (const file of files) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `${file.name} 8 MB limitini aşıyor.` },
          { status: 400 },
        );
      }
      const name = file.name || "document.pdf";
      fileNames.push(name);
      const buf = Buffer.from(await file.arrayBuffer());
      if (name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        const text = await extractPdfText(buf);
        if (text) texts.push(`--- ${name} ---\n${text}`);
      } else if (name.toLowerCase().endsWith(".txt")) {
        texts.push(`--- ${name} ---\n${buf.toString("utf-8")}`);
      }
    }

    const result = await runAnalysis({
      companyName,
      freeText,
      documentText: texts.join("\n\n"),
      fileNames,
      mode: ["fixture", "heuristic", "ai"].includes(mode) ? mode : "fixture",
      runKind: runKind === "heatmap" ? "heatmap" : "analiz",
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analiz hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
