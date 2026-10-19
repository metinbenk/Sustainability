export type MaturityLevel =
  | "Absence"
  | "Emerging"
  | "Progressing"
  | "Established"
  | "Leading"
  | "Aspirational";

export type PamtCategory = "Policy" | "Action" | "Metric" | "Target";

export type EsrsTopicId =
  | "E1"
  | "E2"
  | "E3"
  | "E4"
  | "E5"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "G1";

export type AnalysisMode = "fixture" | "heuristic" | "ai";

export type RunKind = "analiz" | "heatmap";

export interface TopicScore {
  topic: EsrsTopicId;
  weightedScore: number;
  maturityLevel: MaturityLevel;
  policy: number;
  action: number;
  metric: number;
  target: number;
}

export interface SourceEntry {
  sheetName: string;
  indicatorRef: string;
  infoSummary: string;
  sourceType: string;
  documentName: string;
  pageOrUrl: string;
  accessNote: string;
  confidence: string;
}

export interface AnalysisResult {
  companyName: string;
  mode: AnalysisMode;
  label: string;
  runKind: RunKind;
  overall: {
    score: number;
    level: MaturityLevel;
  };
  topics: TopicScore[];
  sources: SourceEntry[];
  gapNote: string;
  aiIntegrationNote?: string;
  generatedAt: string;
}
