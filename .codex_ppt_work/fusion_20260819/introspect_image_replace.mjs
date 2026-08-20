import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const presentation = await PresentationFile.importPptx(
  await FileBlob.load('D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819/template-starter.pptx'),
);
const snap = await presentation.inspect({ kind: 'image', maxChars: 20000 });
const rows = snap.ndjson.split(/\r?\n/).filter(Boolean).map((x) => JSON.parse(x));
const rec = rows.find((x) => x.slide === 3);
const image = presentation.resolve(rec.id);
console.log(JSON.stringify({
  keys: Object.keys(image),
  id: image.id,
  aid: image.aid,
  imageReferenceId: image.imageReferenceId,
  replaceArity: image.replace.length,
  setImageReferenceArity: image.setImageReference.length,
  replaceSource: image.replace.toString(),
  setImageReferenceSource: image.setImageReference.toString(),
  imageCollectionAddSource: presentation.slides.getItem(2).images.add.toString(),
}, null, 2));
