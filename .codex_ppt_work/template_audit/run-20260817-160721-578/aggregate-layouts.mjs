import fs from "node:fs";
import path from "node:path";

const root = "D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/template_audit/run-20260817-160721-578/template-inspect/layouts";
const files = fs.readdirSync(root).filter((name) => name.endsWith(".json")).sort();
const docs = files.map((name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8")));

const counter = () => new Map();
const bump = (map, key) => map.set(String(key), (map.get(String(key)) ?? 0) + 1);
const sorted = (map) => [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

const fonts = counter();
const sizes = counter();
const textColors = counter();
const fillColors = counter();
const lineColors = counter();
const lineSpacing = counter();
const geometries = counter();
const autoFitScales = counter();
const insets = counter();
const alignment = counter();

const perSlide = [];
for (const doc of docs) {
  let textCount = 0;
  let imageCount = 0;
  let shapeCount = 0;
  for (const element of doc.elements ?? []) {
    bump(geometries, element.geometry ?? element.kind);
    if (element.kind === "image") imageCount += 1;
    if (element.kind === "shape") shapeCount += 1;
    if (element.fillColor) bump(fillColors, element.fillColor);
    if (element.lineColor) bump(lineColors, element.lineColor);
    if (element.resolvedTextStyle?.autoFitScale !== undefined) bump(autoFitScales, element.resolvedTextStyle.autoFitScale);
    if (element.resolvedTextStyle?.alignment) bump(alignment, element.resolvedTextStyle.alignment);
    if (element.resolvedTextStyle?.insets) bump(insets, JSON.stringify(element.resolvedTextStyle.insets));
    for (const paragraph of element.paragraphs ?? []) {
      if (paragraph.lineSpacingPercent !== undefined) bump(lineSpacing, paragraph.lineSpacingPercent);
      for (const run of paragraph.runs ?? []) {
        if (!run.text) continue;
        textCount += 1;
        if (run.typeface) bump(fonts, run.typeface);
        if (run.fontSize !== undefined) bump(sizes, run.fontSize);
        if (run.color) bump(textColors, run.color);
      }
    }
  }
  perSlide.push({
    slide: doc.slide.slide,
    background: doc.slide.backgroundColor ?? "(default white)",
    elements: doc.elements.length,
    shapes: shapeCount,
    images: imageCount,
    textRuns: textCount,
    layoutName: doc.slide.layoutName,
    layoutType: doc.slide.layoutType,
    inheritedElementCounts: (doc.inheritedLayers ?? []).map((layer) => ({ scope: layer.scope, count: (layer.elements ?? []).length })),
  });
}

console.log(JSON.stringify({
  perSlide,
  fonts: sorted(fonts),
  fontSizes: sorted(sizes),
  textColors: sorted(textColors),
  fillColors: sorted(fillColors),
  lineColors: sorted(lineColors),
  lineSpacingPercent: sorted(lineSpacing),
  geometries: sorted(geometries),
  autoFitScales: sorted(autoFitScales),
  insets: sorted(insets),
  alignment: sorted(alignment),
}, null, 2));
