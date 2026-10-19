import ExcelJS from "exceljs";
import type { AnalysisResult } from "@/lib/esrs/types";
import { ESRS_TOPICS } from "@/lib/esrs/model";

export async function buildSummaryWorkbook(result: AnalysisResult): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "ESG Olgunluk Platformu MVP";
  wb.created = new Date();

  const summary = wb.addWorksheet("ESRS Olgunluk Özeti");
  summary.addRow([`ESRS Olgunluk Özeti — ${result.companyName}`]);
  summary.addRow([]);
  summary.addRow([
    "Konu",
    "Başlık",
    "Ağırlıklı Skor",
    "Olgunluk Seviyesi",
    "Policy",
    "Action",
    "Metric",
    "Target",
  ]);

  const titleById = Object.fromEntries(ESRS_TOPICS.map((t) => [t.id, t.title]));

  for (const t of result.topics) {
    summary.addRow([
      t.topic,
      titleById[t.topic] || "",
      t.weightedScore,
      t.maturityLevel,
      t.policy,
      t.action,
      t.metric,
      t.target,
    ]);
  }

  summary.addRow([]);
  summary.addRow([
    "Genel ESRS Skoru",
    "",
    result.overall.score,
    result.overall.level,
  ]);
  summary.addRow(["Mod", result.mode, result.label]);
  summary.addRow(["Gap notu", result.gapNote]);

  summary.getRow(1).font = { bold: true, size: 14 };
  summary.getRow(3).font = { bold: true };
  summary.columns = [
    { width: 10 },
    { width: 36 },
    { width: 16 },
    { width: 18 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
  ];

  const sources = wb.addWorksheet("Sources");
  sources.addRow([
    "Sheet Adı",
    "Soru / Indicator Referansı",
    "Kullanılan Bilgi Özeti",
    "Kaynak Türü",
    "Doküman veya Sayfa Adı",
    "Sayfa / Bölüm / URL",
    "Erişim Notu",
    "Güven Düzeyi",
  ]);
  sources.getRow(1).font = { bold: true };
  for (const s of result.sources) {
    sources.addRow([
      s.sheetName,
      s.indicatorRef,
      s.infoSummary,
      s.sourceType,
      s.documentName,
      s.pageOrUrl,
      s.accessNote,
      s.confidence,
    ]);
  }
  sources.columns = [
    { width: 28 },
    { width: 28 },
    { width: 60 },
    { width: 28 },
    { width: 36 },
    { width: 36 },
    { width: 24 },
    { width: 14 },
  ];

  const heat = wb.addWorksheet("Heat Map");
  heat.addRow(["Topic", "Skor", "Policy", "Action", "Metric", "Target"]);
  heat.getRow(1).font = { bold: true };
  for (const t of result.topics) {
    heat.addRow([t.topic, t.weightedScore, t.policy, t.action, t.metric, t.target]);
  }
  heat.addRow([]);
  heat.addRow(["Genel", result.overall.score, result.overall.level]);

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
