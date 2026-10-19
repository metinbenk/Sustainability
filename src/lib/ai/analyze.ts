import { ANALYSIS_PROMPT } from "@/lib/prompts/analysis";
import {
  buildResultFromAssessments,
  heuristicAssessments,
  type IndicatorAssessment,
} from "@/lib/esrs/scoring";
import type { AnalysisMode, AnalysisResult, MaturityLevel, PamtCategory } from "@/lib/esrs/types";
import { ESRS_TOPICS } from "@/lib/esrs/model";
import { loadHmFinalFixture } from "@/lib/fixtures/hm-final";

export interface AnalyzeInput {
  companyName: string;
  freeText: string;
  documentText: string;
  fileNames: string[];
  mode: AnalysisMode;
  runKind: AnalysisResult["runKind"];
}

/**
 * AI integration point.
 * - fixture: gold path from FINAL workbook (UI-demo)
 * - heuristic: keyword stub (no API key)
 * - ai: OpenAI-compatible chat completions → structured assessments → scoring engine
 */
export async function runAnalysis(input: AnalyzeInput): Promise<AnalysisResult> {
  if (input.mode === "fixture") {
    return loadHmFinalFixture({
      companyName: input.companyName,
      runKind: input.runKind,
    });
  }

  if (input.mode === "ai") {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      const stub = heuristicAssessments(
        input.companyName,
        input.documentText,
        input.freeText,
      );
      return buildResultFromAssessments({
        companyName: input.companyName,
        mode: "heuristic",
        label: "Heuristic (AI anahtarı yok — stub)",
        runKind: input.runKind,
        ...stub,
        aiIntegrationNote:
          "OPENAI_API_KEY tanımlı değil. Heuristic stub çalıştı. .env.example dosyasına bakın.",
      });
    }

    try {
      const assessments = await callLlmAssessments(input, key);
      const sources = assessments
        .filter((a) => a.level !== "Absence")
        .map((a) => ({
          sheetName: `${a.topic} Indicator ve Soru Seti`,
          indicatorRef: `${a.topic} / ${a.category}`,
          infoSummary: a.rationale,
          sourceType: "yüklenen doküman / AI çıkarımı",
          documentName: input.fileNames[0] || input.companyName,
          pageOrUrl: a.sourceHint || "—",
          accessNote: "LLM analizi",
          confidence: a.level === "Leading" || a.level === "Aspirational" ? "Orta" : "Düşük-Orta",
        }));

      return buildResultFromAssessments({
        companyName: input.companyName,
        mode: "ai",
        label: "AI analizi (OpenAI-compatible)",
        runKind: input.runKind,
        assessments,
        sources,
        gapNote:
          "AI, topic×PAMT özet seviyeleri üretti. Tam ~456 soru doldurma sonraki dilimde genişletilebilir.",
        aiIntegrationNote:
          "Entegrasyon noktası: src/lib/ai/analyze.ts → callLlmAssessments. Skor motoru Excel PAMT ağırlıklarını kullanır.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "LLM hatası";
      const stub = heuristicAssessments(
        input.companyName,
        input.documentText,
        input.freeText,
      );
      return buildResultFromAssessments({
        companyName: input.companyName,
        mode: "heuristic",
        label: "Heuristic (AI çağrısı başarısız — fallback)",
        runKind: input.runKind,
        ...stub,
        aiIntegrationNote: `AI çağrısı başarısız: ${message}. Heuristic fallback kullanıldı.`,
      });
    }
  }

  // heuristic default
  const stub = heuristicAssessments(
    input.companyName,
    input.documentText,
    input.freeText,
  );
  return buildResultFromAssessments({
    companyName: input.companyName,
    mode: "heuristic",
    label: "Heuristic stub (anahtar kelime)",
    runKind: input.runKind,
    ...stub,
    aiIntegrationNote:
      "Canlı LLM için mode=ai ve OPENAI_API_KEY. Demo skorlar için mode=fixture (H&M FINAL).",
  });
}

async function callLlmAssessments(
  input: AnalyzeInput,
  apiKey: string,
): Promise<IndicatorAssessment[]> {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const topicList = ESRS_TOPICS.map((t) => t.id).join(", ");
  const userPayload = {
    companyName: input.companyName,
    fileNames: input.fileNames,
    freeText: input.freeText.slice(0, 6000),
    documentExcerpt: input.documentText.slice(0, 14000),
    instruction: `Her topic (${topicList}) için Policy, Action, Metric, Target seviyelerini Absence|Emerging|Progressing|Established|Leading|Aspirational olarak ver. Kanıt yoksa Absence. JSON dizi: [{topic,category,level,rationale,sourceHint}]`,
  };

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            ANALYSIS_PROMPT.slice(0, 6000) +
            "\n\nÇıktıyı yalnızca şu JSON şemasında ver: {\"assessments\":[...]}",
        },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Boş LLM yanıtı");

  const parsed = JSON.parse(content) as {
    assessments?: Array<{
      topic: string;
      category: string;
      level: string;
      rationale?: string;
      sourceHint?: string;
    }>;
  };

  const levels = new Set([
    "Absence",
    "Emerging",
    "Progressing",
    "Established",
    "Leading",
    "Aspirational",
  ]);
  const cats = new Set(["Policy", "Action", "Metric", "Target"]);
  const topics = new Set(ESRS_TOPICS.map((t) => t.id));

  const out: IndicatorAssessment[] = [];
  for (const a of parsed.assessments || []) {
    if (!topics.has(a.topic as never)) continue;
    if (!cats.has(a.category)) continue;
    if (!levels.has(a.level)) continue;
    out.push({
      topic: a.topic as IndicatorAssessment["topic"],
      category: a.category as PamtCategory,
      level: a.level as MaturityLevel,
      rationale: a.rationale || "",
      sourceHint: a.sourceHint,
    });
  }

  if (out.length < 10) {
    throw new Error("LLM assessments yetersiz / şema uyumsuz");
  }
  return out;
}
