import fs from "fs";
import path from "path";

const INPUT_FILE = path.join(process.cwd(), "stocks.json");
const OUTPUT_FILE = path.join(process.cwd(), "stocks.us.common.json");

const US_MIC = new Set([
  "XNYS", // NYSE
  "XNAS", // NASDAQ
  // 'ARCA', // NYSE Arca
  "XASE", // NYSE Arca
  // 'BATS', // Cboe BZX
  // 'IEXG', // IEX
  // 'OOTC', // OTC Markets
]);

// const TYPES = new Set(['Common Stock', 'REIT', 'ADR']);
const TYPES = new Set(["ETP"]);

console.log("Reading stocks.json...");
const raw = fs.readFileSync(INPUT_FILE, "utf-8");
const stocks = JSON.parse(raw);

console.log(`Total instruments: ${stocks.length}`);

const filtered = stocks.filter((s) => TYPES.has(s.type) && US_MIC.has(s.mic));

console.log(`US‑tradable common stocks: ${filtered.length}`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filtered, null, 2), "utf-8");

console.log(`Saved to ${OUTPUT_FILE}`);
