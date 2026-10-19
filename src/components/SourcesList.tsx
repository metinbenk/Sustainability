import type { SourceEntry } from "@/lib/esrs/types";

export function SourcesList({ sources }: { sources: SourceEntry[] }) {
  if (!sources.length) {
    return (
      <section className="rounded-xl border border-dashed border-ink/20 bg-white/50 p-5 text-sm text-slate">
        Sources boş — kanıt izi üretilmedi.
      </section>
    );
  }

  return (
    <section className="animate-rise-delay rounded-xl border border-ink/10 bg-white/70 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-1 font-display text-xl text-ink">Sources — kanıt izi</h2>
      <p className="mb-4 text-sm text-slate">
        {sources.length} kayıt (MVP kısmi liste; FINAL demoda örnek satırlar)
      </p>
      <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {sources.map((s, i) => (
          <li
            key={`${s.indicatorRef}-${i}`}
            className="rounded-lg border border-ink/8 bg-mist/60 px-3 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
              <span className="font-medium text-spruce">{s.sheetName}</span>
              <span>·</span>
              <span>{s.indicatorRef || "—"}</span>
              <span className="ml-auto rounded bg-white/80 px-1.5 py-0.5">
                {s.confidence || "—"}
              </span>
            </div>
            <p className="mt-1 text-ink/90">{s.infoSummary}</p>
            <p className="mt-1 text-xs text-slate">
              {s.documentName}
              {s.pageOrUrl ? ` · ${s.pageOrUrl}` : ""}
              {s.sourceType ? ` · ${s.sourceType}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
