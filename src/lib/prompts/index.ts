import { ANALYSIS_PROMPT, ANALYSIS_PROMPT_ID } from "./analysis";
import { VISUAL_PROMPT, VISUAL_PROMPT_ID } from "./visual";

export const PROMPT_LIBRARY = {
  analiz: {
    id: ANALYSIS_PROMPT_ID,
    title: "ESRS Analiz Promptu",
    description:
      "Soru setlerini kanıt temelli doldurur; seviye atar; Sources izi üretir. Excel formüllerini bozmama kuralı ürün motoruna taşındı.",
    body: ANALYSIS_PROMPT,
  },
  heatmap: {
    id: VISUAL_PROMPT_ID,
    title: "ESRS Heat Map Görsel Promptu",
    description:
      "Özet tablosundan C-level 16:9 heat map dilini tanımlar. MVP’de tablo/görsel ürün içinde üretilir.",
    body: VISUAL_PROMPT,
  },
} as const;

export type PromptKey = keyof typeof PROMPT_LIBRARY;
