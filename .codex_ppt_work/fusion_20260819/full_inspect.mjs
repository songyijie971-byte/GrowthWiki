import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const source = 'D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819/source.pptx';
const output = 'D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819/template-inspect/template-inspect-full.ndjson';

const presentation = await PresentationFile.importPptx(await FileBlob.load(source));
const snapshot = await presentation.inspect({
  kind: 'deck,slide,textbox,shape,image,table,chart,notes,layout',
  include: 'id,slide,name,title,text,textPreview,textChars,textLines,bbox,bboxUnit,isPlaceholder,placeholders,alt,preview,layoutId',
  maxChars: 200000,
});
await fs.writeFile(output, snapshot.ndjson, 'utf8');
console.log(output);
