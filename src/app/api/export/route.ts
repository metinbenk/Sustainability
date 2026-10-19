import { NextRequest, NextResponse } from "next/server";
import { buildSummaryWorkbook } from "@/lib/export/excel";
import type { AnalysisResult } from "@/lib/esrs/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const result = (await req.json()) as AnalysisResult;
    if (!result?.companyName || !result?.topics?.length) {
      return NextResponse.json({ error: "Geçersiz sonuç payload." }, { status: 400 });
    }

    const buffer = await buildSummaryWorkbook(result);
    const safeName = result.companyName.replace(/[^\w\-]+/g, "_").slice(0, 40);
    const filename = `ESRS_Olgunluk_Ozeti_${safeName}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
