import { scoreHeatColor } from "@/lib/esrs/model";
import type { TopicScore } from "@/lib/esrs/types";

const COLS = ["Skor", "Policy", "Action", "Metric", "Target"] as const;

function cellValue(t: TopicScore, col: (typeof COLS)[number]): number {
  switch (col) {
    case "Skor":
      return t.weightedScore;
    case "Policy":
      return t.policy;
    case "Action":
      return t.action;
    case "Metric":
      return t.metric;
    case "Target":
      return t.target;
  }
}

export function HeatMap({
  topics,
  overallScore,
  overallLevel,
  companyName,
}: {
  topics: TopicScore[];
  overallScore: number;
  overallLevel: string;
  companyName: string;
}) {
  return (
    <section className="animate-rise-delay rounded-xl border border-ink/10 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink">
            {companyName} — ESRS Olgunluk Heat Map
          </h2>
          <p className="text-sm text-slate">Konu bazlı görünüm · 0–100 ölçeği</p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-lg bg-spruce/10 px-3 py-2">
            <div className="text-xs uppercase tracking-wide text-slate">Genel skor</div>
            <div className="font-display text-lg text-spruce">{overallScore}</div>
          </div>
          <div className="rounded-lg bg-clay/10 px-3 py-2">
            <div className="text-xs uppercase tracking-wide text-slate">Olgunluk</div>
            <div className="font-display text-lg text-clay">{overallLevel}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-ink/10 bg-mist px-2 py-2 text-left font-medium">
                Topic
              </th>
              {COLS.map((c) => (
                <th
                  key={c}
                  className="border border-ink/10 bg-mist px-2 py-2 text-center font-medium"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topics.map((t) => (
              <tr key={t.topic}>
                <td className="border border-ink/10 px-2 py-2 font-medium">
                  <span className="text-slate">
                    {t.topic.startsWith("E")
                      ? "ENV"
                      : t.topic.startsWith("S")
                        ? "SOC"
                        : "GOV"}
                  </span>{" "}
                  {t.topic}
                </td>
                {COLS.map((c) => {
                  const v = cellValue(t, c);
                  return (
                    <td
                      key={c}
                      className="border border-ink/10 px-2 py-2 text-center font-medium text-white"
                      style={{ backgroundColor: scoreHeatColor(v) }}
                      title={`${t.topic} ${c}: ${v}`}
                    >
                      {v.toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate">Yeşil güçlü · Kırmızı zayıf · PAMT: P20 / A30 / M30 / T20</p>
    </section>
  );
}
