import {
  ESRS_TOPICS,
  overallMaturityFromScore,
  PAMT_WEIGHTS,
  scoreFromLevel,
  topicMaturityFromScore,
} from "./model";
import type {
  AnalysisMode,
  AnalysisResult,
  MaturityLevel,
  PamtCategory,
  RunKind,
  SourceEntry,
  TopicScore,
} from "./types";

export interface IndicatorAssessment {
  topic: TopicScore["topic"];
  category: PamtCategory;
  level: MaturityLevel;
  rationale: string;
  sourceHint?: string;
}

/** Weighted topic score = Σ (avg_by_PAMT × weight) */
export function computeTopicScore(
  assessments: IndicatorAssessment[],
): Omit<TopicScore, "topic" | "maturityLevel"> & { maturityLevel: MaturityLevel } {
  const byCat: Record<PamtCategory, number[]> = {
    Policy: [],
    Action: [],
    Metric: [],
    Target: [],
  };

  for (const a of assessments) {
    byCat[a.category].push(scoreFromLevel(a.level));
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;

  const policy = avg(byCat.Policy);
  const action = avg(byCat.Action);
  const metric = avg(byCat.Metric);
  const target = avg(byCat.Target);

  const weightedScore =
    policy * PAMT_WEIGHTS.Policy +
    action * PAMT_WEIGHTS.Action +
    metric * PAMT_WEIGHTS.Metric +
    target * PAMT_WEIGHTS.Target;

  return {
    weightedScore: round1(weightedScore),
    maturityLevel: topicMaturityFromScore(weightedScore),
    policy: round1(policy),
    action: round1(action),
    metric: round1(metric),
    target: round1(target),
  };
}

export function computeOverall(topics: TopicScore[]) {
  const score =
    topics.reduce((s, t) => s + t.weightedScore, 0) / Math.max(topics.length, 1);
  return {
    score: round1(score),
    level: overallMaturityFromScore(score),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Lightweight heuristic when LLM is unavailable.
 * Maps keyword coverage in uploaded text → maturity levels per topic/PAMT.
 * Clear AI integration point: replace with LLM-filled assessments.
 */
export function heuristicAssessments(
  companyName: string,
  documentText: string,
  freeText: string,
): { assessments: IndicatorAssessment[]; sources: SourceEntry[]; gapNote: string } {
  const corpus = `${documentText}\n${freeText}`.toLowerCase();
  const hasDocs = documentText.trim().length > 80 || freeText.trim().length > 40;

  const keywordSets: Record<
    TopicScore["topic"],
    { keys: string[]; categories: PamtCategory[] }
  > = {
    E1: {
      keys: ["climate", "carbon", "emission", "ghg", "net zero", "iklim", "emisyon", "sbti"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    E2: {
      keys: ["pollution", "chemical", "wastewater", "kirlilik", "kimyasal", "zdhc"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    E3: {
      keys: ["water", "su ", "marine", "deniz", "wastewater"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    E4: {
      keys: ["biodiversity", "biyoçeşit", "deforestation", "ormansız"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    E5: {
      keys: ["circular", "recycle", "döngü", "waste", "atık", "material"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    S1: {
      keys: ["employee", "workforce", "işgücü", "diversity", "çalışan", "human rights"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    S2: {
      keys: ["supply chain", "supplier", "tedarik", "value chain", "living wage"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    S3: {
      keys: ["community", "topluluk", "indigenous", "local"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    S4: {
      keys: ["consumer", "customer", "privacy", "tüketici", "product safety"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
    G1: {
      keys: ["governance", "ethics", "anti-corruption", "yönetişim", "whistle", "speak up"],
      categories: ["Policy", "Action", "Metric", "Target"],
    },
  };

  const assessments: IndicatorAssessment[] = [];
  const sources: SourceEntry[] = [];

  for (const topic of ESRS_TOPICS) {
    const set = keywordSets[topic.id];
    const hits = set.keys.filter((k) => corpus.includes(k)).length;
    const ratio = hits / set.keys.length;

    for (const category of set.categories) {
      let level: MaturityLevel = "Absence";
      if (!hasDocs) {
        level = "Absence";
      } else if (ratio >= 0.55) {
        level = category === "Metric" || category === "Target" ? "Progressing" : "Established";
      } else if (ratio >= 0.3) {
        level = "Progressing";
      } else if (ratio > 0) {
        level = "Emerging";
      }

      assessments.push({
        topic: topic.id,
        category,
        level,
        rationale: hasDocs
          ? `${topic.id}/${category}: metin içinde ${hits}/${set.keys.length} anahtar kelime eşleşmesi (heuristic stub).`
          : "Kanıt yok — yüklenen içerik yetersiz (Absence).",
        sourceHint: hasDocs ? "Yüklenen PDF / serbest metin" : undefined,
      });

      if (hasDocs && level !== "Absence") {
        sources.push({
          sheetName: `${topic.id} Indicator ve Soru Seti`,
          indicatorRef: `${topic.id} / ${category}`,
          infoSummary: assessments[assessments.length - 1].rationale,
          sourceType: "yüklenen doküman / serbest metin",
          documentName: companyName || "Yüklenen dosyalar",
          pageOrUrl: "—",
          accessNote: "Heuristic stub — LLM entegrasyon noktası",
          confidence: ratio >= 0.55 ? "Orta" : "Düşük",
        });
      }
    }
  }

  const gapNote = hasDocs
    ? "Heuristic skorlama anahtar kelime yoğunluğuna dayanır; gerçek ESRS soru seti (~456) ve kanıt derinliği için AI entegrasyonu veya FINAL fixture demosu kullanın."
    : "Doküman/metin yüklenmediği için skorlar Absence ağırlıklıdır. Demo için H&M FINAL fixture’ını seçin.";

  return { assessments, sources, gapNote };
}

export function buildResultFromAssessments(opts: {
  companyName: string;
  mode: AnalysisMode;
  label: string;
  runKind: RunKind;
  assessments: IndicatorAssessment[];
  sources: SourceEntry[];
  gapNote: string;
  aiIntegrationNote?: string;
}): AnalysisResult {
  const topics: TopicScore[] = ESRS_TOPICS.map((t) => {
    const subset = opts.assessments.filter((a) => a.topic === t.id);
    const scored = computeTopicScore(subset);
    return { topic: t.id, ...scored };
  });

  return {
    companyName: opts.companyName,
    mode: opts.mode,
    label: opts.label,
    runKind: opts.runKind,
    overall: computeOverall(topics),
    topics,
    sources: opts.sources,
    gapNote: opts.gapNote,
    aiIntegrationNote: opts.aiIntegrationNote,
    generatedAt: new Date().toISOString(),
  };
}
