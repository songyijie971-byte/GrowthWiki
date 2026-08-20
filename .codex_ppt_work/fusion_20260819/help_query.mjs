import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const presentation = await PresentationFile.importPptx(
  await FileBlob.load('D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819/template-starter.pptx'),
);
for (const search of [
  'remove shape delete element shapes collection',
  'duplicate imported slide remove shape',
  'image frame crop fit replace',
  'text replace preserve formatting imported text',
]) {
  const result = presentation.help('*', {
    search,
    include: ['index', 'examples', 'notes'],
    maxChars: 12000,
  });
  console.log(`===== ${search} =====`);
  console.log(JSON.stringify(result, null, 2));
}
