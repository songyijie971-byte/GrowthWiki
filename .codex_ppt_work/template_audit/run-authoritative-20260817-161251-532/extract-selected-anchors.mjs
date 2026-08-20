import fs from "node:fs/promises";

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const selectedSlides = new Set([1, 2, 3, 4, 7, 8]);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node extract-selected-anchors.mjs <full-inspect.ndjson> <output.ndjson>");
}

const lines = (await fs.readFile(inputPath, "utf8")).split(/\r?\n/).filter(Boolean);
const records = lines
  .map((line) => JSON.parse(line))
  .filter((record) => selectedSlides.has(record.slide) && ["textbox", "image"].includes(record.kind));

await fs.writeFile(outputPath, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outputPath, records: records.length }));
