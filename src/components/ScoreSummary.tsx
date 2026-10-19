import { ESRS_TOPICS } from "@/lib/esrs/model";
import type { AnalysisResult } from "@/lib/esrs/types";

const titleById = Object.fromEntries(ESRS_TOPICS.map((t) => [t.id, t.title]));

export function ScoreSummary({ result }: { result: AnalysisResult }) {
  return (
    <section className="animate-rise rounded-xl border border-ink/10 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-ink">ESRS Olgunluk Özeti</h2>
        <span className="rounded-md bg-sand px-2 py-1 text-xs text-slate">
          {result.label}
        </span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-spruce/20 bg-spruce/5 p-4">
          <div className="text-xs uppercase tracking-wide text-slate">Genel ESRS Skoru</div>
          <div className="font-display text-3xl text-spruce">{result.overall.score}</div>
        </div>
        <div className="rounded-lg border border-clay/20 bg-clay/5 p-4">
          <div className="text-xs uppercase tracking-wide text-slate">Olgunluk seviyesi</div>
          <div className="font-display text-2xl text-clay">{result.overall.level}</div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-mist/80 p-4">
          <div className="text-xs uppercase tracking-wide text-slate">Mod</div>
          <div className="text-sm font-medium">{result.mode}</div>
          <div className="text-xs text-slate">{result.runKind === "heatmap" ? "Heat Map" : "Analiz"}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-slate">
              <th className="py-2 pr-2 font-medium">Konu</th>
              <th className="py-2 pr-2 font-medium">Ağırlıklı skor</th>
              <th className="py-2 pr-2 font-medium">Seviye</th>
              <th className="py-2 pr-2 font-medium">P</th>
              <th className="py-2 pr-2 font-medium">A</th>
              <th className="py-2 pr-2 font-medium">M</th>
              <th className="py-2 font-medium">T</th>
            </tr>
          </thead>
          <tbody>
            {result.topics.map((t) => (
              <tr key={t.topic} className="border-b border-ink/8">
                <td className="py-2 pr-2">
                  <span className="font-semibold">{t.topic}</span>
                  <span className="ml-2 text-slate">{titleById[t.topic]}</span>
                </td>
                <td className="py-2 pr-2 font-medium">{t.weightedScore.toFixed(1)}</td>
                <td className="py-2 pr-2">{t.maturityLevel}</td>
                <td className="py-2 pr-2">{t.policy.toFixed(1)}</td>
                <td className="py-2 pr-2">{t.action.toFixed(1)}</td>
                <td className="py-2 pr-2">{t.metric.toFixed(1)}</td>
                <td className="py-2">{t.target.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.gapNote && (
        <p className="mt-4 rounded-lg bg-mist px-3 py-2 text-sm text-ink/80">{result.gapNote}</p>
      )}
      {result.aiIntegrationNote && (
        <p className="mt-2 text-xs text-slate">{result.aiIntegrationNote}</p>
      )}
    </section>
  );
}
