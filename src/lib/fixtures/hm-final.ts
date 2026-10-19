import type { AnalysisResult, MaturityLevel, TopicScore } from "@/lib/esrs/types";
import raw from "./hm-final.json";

type FixtureJson = {
  companyName: string;
  mode: "fixture";
  label: string;
  overall: { score: number; level: string };
  topics: TopicScore[];
  sources: AnalysisResult["sources"];
  gapNote: string;
};

const fixture = raw as FixtureJson;

/** Gold sample from HM_ESRS_olgunluk_modeli_FINAL.xlsx — ESRS Olgunluk Özeti */
export function loadHmFinalFixture(opts: {
  companyName?: string;
  runKind: AnalysisResult["runKind"];
}): AnalysisResult {
  return {
    companyName: opts.companyName?.trim() || fixture.companyName,
    mode: "fixture",
    label: fixture.label,
    runKind: opts.runKind,
    overall: {
      score: fixture.overall.score,
      level: fixture.overall.level as MaturityLevel,
    },
    topics: fixture.topics,
    sources: fixture.sources,
    gapNote: fixture.gapNote,
    aiIntegrationNote:
      "Bu sonuç FINAL Excel workbook (H&M) skorlarından yüklenmiştir. Canlı PDF→AI analizi için OPENAI_API_KEY ile AI modunu kullanın.",
    generatedAt: new Date().toISOString(),
  };
}
