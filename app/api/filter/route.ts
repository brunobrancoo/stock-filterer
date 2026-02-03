import { NextResponse } from "next/server";
import stocks from "@/lib/utils/stocks.json";

interface Stock {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  isin: string;
  mic: string;
  shareClassFIGI: string;
  symbol: string;
  symbol2: string;
  type: string;
}

export async function POST(request: Request) {
  try {
    const { types, mics } = await request.json();

    const typesSet = new Set(types.filter((t: string) => t));
    const micsSet = new Set(mics.filter((m: string) => m));

    const filtered = stocks.filter((s: Stock) => {
      const typeMatch = typesSet.size > 0 ? typesSet.has(s.type) : true;
      const micMatch = micsSet.size > 0 ? micsSet.has(s.mic) : true;
      return typeMatch && micMatch;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
