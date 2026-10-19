import type { EsrsTopicId, MaturityLevel, PamtCategory } from "./types";

/** Level → 0–100 (Excel: ESRS Olgunluk Modeli) */
export const LEVEL_SCORES: Record<MaturityLevel, number> = {
  Absence: 0,
  Emerging: 20,
  Progressing: 40,
  Established: 60,
  Leading: 80,
  Aspirational: 100,
};

/** PAMT weights — Policy 20 / Action 30 / Metric 30 / Target 20 */
export const PAMT_WEIGHTS: Record<PamtCategory, number> = {
  Policy: 0.2,
  Action: 0.3,
  Metric: 0.3,
  Target: 0.2,
};

export const ESRS_TOPICS: {
  id: EsrsTopicId;
  pillar: "Environment" | "Social" | "Governance";
  title: string;
}[] = [
  { id: "E1", pillar: "Environment", title: "İklim değişikliği" },
  { id: "E2", pillar: "Environment", title: "Kirlilik" },
  { id: "E3", pillar: "Environment", title: "Su ve deniz kaynakları" },
  { id: "E4", pillar: "Environment", title: "Biyoçeşitlilik" },
  { id: "E5", pillar: "Environment", title: "Kaynak kullanımı & döngüsel ekonomi" },
  { id: "S1", pillar: "Social", title: "Kendi işgücü" },
  { id: "S2", pillar: "Social", title: "Değer zinciri çalışanları" },
  { id: "S3", pillar: "Social", title: "Etkilenen topluluklar" },
  { id: "S4", pillar: "Social", title: "Tüketiciler / son kullanıcılar" },
  { id: "G1", pillar: "Governance", title: "İş davranışı" },
];

/**
 * Overall maturity bands from Excel overall point scale.
 * Note: Excel maps 0–20 → Emerging (Absence only at indicator level).
 */
export function overallMaturityFromScore(score: number): MaturityLevel {
  if (score <= 20) return "Emerging";
  if (score <= 40) return "Progressing";
  if (score <= 60) return "Established";
  if (score <= 80) return "Leading";
  return "Aspirational";
}

export function topicMaturityFromScore(score: number): MaturityLevel {
  if (score <= 0) return "Absence";
  if (score <= 20) return "Emerging";
  if (score <= 40) return "Progressing";
  if (score <= 60) return "Established";
  if (score <= 80) return "Leading";
  return "Aspirational";
}

export function scoreFromLevel(level: MaturityLevel): number {
  return LEVEL_SCORES[level];
}

/** Heat-map cell color (0–100 → red→amber→green) */
export function scoreHeatColor(score: number): string {
  const t = Math.max(0, Math.min(100, score)) / 100;
  const r = Math.round(180 + (40 - 180) * t);
  const g = Math.round(60 + (140 - 60) * t);
  const b = Math.round(50 + (90 - 50) * t);
  return `rgb(${r}, ${g}, ${b})`;
}
