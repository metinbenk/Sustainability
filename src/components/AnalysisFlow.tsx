"use client";

import { useState } from "react";
import type { AnalysisMode, AnalysisResult, RunKind } from "@/lib/esrs/types";
import { HeatMap } from "./HeatMap";
import { ScoreSummary } from "./ScoreSummary";
import { SourcesList } from "./SourcesList";

const MODES: { id: AnalysisMode; title: string; hint: string }[] = [
  {
    id: "fixture",
    title: "Demo Fixture (H&M FINAL)",
    hint: "FINAL workbook özet skorları — UI’yı göstermek için altın örnek",
  },
  {
    id: "heuristic",
    title: "Heuristic stub",
    hint: "PDF/metin anahtar kelime → skor motoru (API anahtarı gerekmez)",
  },
  {
    id: "ai",
    title: "AI analizi",
    hint: "OPENAI_API_KEY ile LLM; yoksa heuristic fallback",
  },
];

export function AnalysisFlow() {
  const [companyName, setCompanyName] = useState("H&M");
  const [freeText, setFreeText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("fixture");
  const [runKind, setRunKind] = useState<RunKind>("analiz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [exporting, setExporting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.set("companyName", companyName);
      form.set("freeText", freeText);
      form.set("mode", mode);
      form.set("runKind", runKind);
      if (files) {
        Array.from(files).forEach((f) => form.append("files", f));
      }
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analiz başarısız");
      setResult(data as AnalysisResult);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  async function onExport() {
    if (!result) return;
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Excel export başarısız");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ESRS_Olgunluk_Ozeti_${result.companyName.replace(/\s+/g, "_")}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export hatası");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <header className="animate-rise mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">GO-153 · MVP ilk dilim</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
          ESG Olgunluk Analizi
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">
          ESRS modeli ve analiz/görsel promptları ürüne gömülü. Firma → PDF → Analiz / Heat Map →
          özet skor, Sources ve Excel.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="animate-rise-delay mb-10 space-y-5 rounded-2xl border border-ink/10 bg-white/75 p-5 shadow-sm backdrop-blur sm:p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="company">
            Firma adı
          </label>
          <input
            id="company"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none ring-spruce/30 focus:ring-2"
            placeholder="örn. H&M, LCW"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="files">
            PDF yükle (opsiyonel — demo fixture için gerekmez)
          </label>
          <input
            id="files"
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-spruce file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          <p className="mt-1 text-xs text-slate">En fazla 5 dosya · dosya başı 8 MB</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="freeText">
            Serbest metin (opsiyonel)
          </label>
          <textarea
            id="freeText"
            rows={3}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none ring-spruce/30 focus:ring-2"
            placeholder="Ek bağlam, politika özeti veya analist notu…"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Çalıştırma modu</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {MODES.map((m) => (
              <label
                key={m.id}
                className={`cursor-pointer rounded-lg border px-3 py-3 text-sm transition ${
                  mode === m.id
                    ? "border-spruce bg-spruce/8"
                    : "border-ink/10 bg-white hover:border-ink/25"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                />
                <div className="font-medium text-ink">{m.title}</div>
                <div className="mt-1 text-xs text-slate">{m.hint}</div>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Prompt / çıktı</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["analiz", "Analiz çalıştır"],
                ["heatmap", "Analiz + Heat Map"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRunKind(id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  runKind === id
                    ? "bg-ink text-white"
                    : "bg-sand text-ink hover:bg-sand/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate">
            Promptlar ürün içinde gömülü (kopyala-yapıştır yok). Heat Map seçimi özet üzerine tablo
            görseli ekler.
          </p>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-spruce px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-moss disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse-soft">Analiz çalışıyor…</span>
            ) : (
              "Çalıştır"
            )}
          </button>
          {result && (
            <button
              type="button"
              onClick={onExport}
              disabled={exporting}
              className="rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm font-medium hover:bg-mist disabled:opacity-60"
            >
              {exporting ? "Excel hazırlanıyor…" : "Excel özet indir"}
            </button>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="space-y-6">
          <ScoreSummary result={result} />
          {(result.runKind === "heatmap" || runKind === "heatmap") && (
            <HeatMap
              topics={result.topics}
              overallScore={result.overall.score}
              overallLevel={result.overall.level}
              companyName={result.companyName}
            />
          )}
          <SourcesList sources={result.sources} />
        </div>
      )}

      <footer className="mt-12 border-t border-ink/10 pt-6 text-xs text-slate">
        Admin-first MVP · E-posta, ERP, tedarikçi portalı, tam maskeleme ve sektör ortalaması sonraki
        faz. Model: PAMT P20/A30/M30/T20 · topic’ler E1–E5 S1–S4 G1.
      </footer>
    </div>
  );
}
