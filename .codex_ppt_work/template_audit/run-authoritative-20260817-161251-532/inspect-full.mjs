import fs from "node:fs/promises";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const sourcePptx = process.argv[2];
const outputNdjson = process.argv[3];
const outputMetadata = process.argv[4];

if (!sourcePptx || !outputNdjson || !outputMetadata) {
  throw new Error("Usage: node inspect-full.mjs <source.pptx> <output.ndjson> <metadata.json>");
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePptx));
const snapshot = await presentation.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes,layout",
  include: "id,slide,name,title,text,textPreview,textChars,textLines,bbox,bboxUnit,isPlaceholder,placeholders,alt,prompt",
  maxChars: 200000,
});

await fs.writeFile(outputNdjson, snapshot.ndjson ?? "", "utf8");
await fs.writeFile(
  outputMetadata,
  `${JSON.stringify({ truncated: Boolean(snapshot.truncated), metadata: snapshot.metadata ?? {} }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({ outputNdjson, outputMetadata, truncated: Boolean(snapshot.truncated) }));
