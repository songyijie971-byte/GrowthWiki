import fs from "node:fs";
import path from "node:path";

const root = "D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/template_audit/run-20260817-160721-578/template-inspect/layouts";
const requestedSlide = Number.parseInt(process.argv[2] ?? "", 10);

for (const name of fs.readdirSync(root).filter((name) => name.endsWith(".json")).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  const slide = data.slide;
  if (Number.isFinite(requestedSlide) && slide.slide !== requestedSlide) continue;
  const elements = data.elements ?? [];
  const inherited = data.inheritedLayers ?? [];
  console.log(`\n===== SLIDE ${slide.slide} =====`);
  console.log(JSON.stringify({
    layoutName: slide.layoutName,
    layoutType: slide.layoutType,
    layoutId: slide.layoutId,
    masterLayoutId: slide.masterLayoutId,
    backgroundColor: slide.backgroundColor,
    frame: slide.frame,
    theme: data.theme,
    inheritedLayers: inherited.map((layer) => ({
      scope: layer.scope,
      id: layer.id,
      name: layer.name,
      type: layer.type,
      parentLayoutId: layer.parentLayoutId,
      elementCount: (layer.elements ?? []).length,
      elements: layer.elements ?? [],
    })),
    counts: elements.reduce((acc, element) => {
      acc[element.kind] = (acc[element.kind] ?? 0) + 1;
      return acc;
    }, {}),
  }, null, 2));

  for (const element of elements) {
    const textRuns = (element.paragraphs ?? []).flatMap((paragraph) =>
      (paragraph.runs ?? []).map((run) => ({
        text: run.text,
        fontSize: run.fontSize,
        typeface: run.typeface,
        color: run.color,
        bold: run.bold,
        italic: run.italic,
      })),
    );
    const paragraphStyles = (element.paragraphs ?? []).map((paragraph) => ({
      lineSpacingPercent: paragraph.lineSpacingPercent,
      spacingBefore: paragraph.spacingBefore,
      spacingAfter: paragraph.spacingAfter,
      alignment: paragraph.resolvedTextStyle?.alignment,
      fontSize: paragraph.resolvedTextStyle?.fontSize,
      typeface: paragraph.resolvedTextStyle?.typeface,
      color: paragraph.resolvedTextStyle?.color,
      bold: paragraph.resolvedTextStyle?.bold,
      bulletCharacter: paragraph.bulletCharacter,
      marginLeft: paragraph.marginLeft,
    }));
    console.log(JSON.stringify({
      order: element.order,
      kind: element.kind,
      aid: element.aid,
      id: element.id,
      name: element.name,
      bbox: element.bbox,
      geometry: element.geometry,
      textPreview: element.textPreview,
      fillColor: element.fillColor,
      lineColor: element.lineColor,
      lineWidth: element.lineWidth,
      image: element.image,
      placeholder: element.placeholder,
      resolvedTextStyle: element.resolvedTextStyle,
      paragraphStyles,
      textRuns,
    }));
  }
}
