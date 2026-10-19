# ESG Olgunluk Analizi ve Yapay Zeka Platformu (GO-153)

MVP ilk dilim — LCW / Metin Benk. Manuel Excel + prompt kopyalama sürecini ürüne gömer; chatbot-benzeri tek akışla skor özeti, heat map, Sources ve Excel export sunar.

## Hızlı başlangıç

```bash
npm install
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

İsteğe bağlı AI:

```bash
cp .env.example .env.local
# OPENAI_API_KEY=...
```

## Akış

1. Firma adı
2. PDF(ler) + opsiyonel serbest metin
3. Mod: **Demo Fixture (H&M FINAL)** · Heuristic stub · AI
4. **Analiz** veya **Analiz + Heat Map**
5. ESRS Olgunluk Özeti (genel + topic + PAMT) · Sources · Excel indir

## Gömülü model

- Seviye → skor: Absence 0 … Aspirational 100
- PAMT: Policy 20% / Action 30% / Metric 30% / Target 20%
- Topic’ler: E1–E5, S1–S4, G1
- Promptlar: `src/lib/prompts/` (analiz + görsel)
- Altın demo: `src/lib/fixtures/hm-final.json` ← FINAL workbook özeti

## AI entegrasyon noktası

`src/lib/ai/analyze.ts` — `callLlmAssessments` LLM çıktısını skor motoruna bağlar. Anahtar yoksa heuristic fallback.

## Kapsam dışı (bilinçli)

Tam dashboard, e-posta, ERP, tedarikçi portalı, maskeleme motoru, sektör ortalaması / geçmiş grafikler, admin kriter paneli.

Ayrıntılı run notu (Project store): `docs/mvp-ilk-dilim.md`
