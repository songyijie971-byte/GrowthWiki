import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const presentation = await PresentationFile.importPptx(
  await FileBlob.load('D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819/template-starter.pptx'),
);
const slide = presentation.slides.getItem(5);
const snap = await presentation.inspect({ kind: 'shape,image,textbox', maxChars: 20000 });
const rows = snap.ndjson.split(/\r?\n/).filter(Boolean).map((x) => JSON.parse(x));
const shapeRec = rows.find((x) => x.kind === 'shape' && x.slide === 6);
const imageRec = rows.find((x) => x.kind === 'image' && x.slide === 6);
const textRec = rows.find((x) => x.kind === 'textbox' && x.slide === 6);

function methods(value) {
  const out = [];
  let current = value;
  while (current && current !== Object.prototype) {
    out.push({ ctor: current.constructor?.name, props: Object.getOwnPropertyNames(current) });
    current = Object.getPrototypeOf(current);
  }
  return out;
}

console.log(JSON.stringify({
  slide: methods(slide),
  shapes: methods(slide.shapes),
  shape: methods(presentation.resolve(shapeRec.id)),
  image: methods(presentation.resolve(imageRec.id)),
  text: methods(presentation.resolve(textRec.id)),
  textFacade: methods(presentation.resolve(textRec.id).text),
}, null, 2));
