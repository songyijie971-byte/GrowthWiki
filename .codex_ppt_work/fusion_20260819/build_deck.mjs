import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const WORK = 'D:/Data/GraduateWorkspace/01_ObsidianVault/.codex_ppt_work/fusion_20260819';
const STARTER = `${WORK}/template-starter.pptx`;
const FINAL = 'C:/Users/12394/WPSDrive/1659757995/WPS企业云盘/中国石油大学(北京)/我的企业文档/组会ppt/2026-08-19  宋奕杰（官网链接版）.pptx';

const ASSETS = {
  localOverview: `${WORK}/assets/Autoware视觉-LiDAR融合局部.png`,
  roiMatch: 'D:/Data/GraduateWorkspace/01_ObsidianVault/50_智能驾驶/99_图片/Autoware-ROI聚类融合.png',
  roiPipeline: `${WORK}/assets/Autoware官网-ROI聚类融合内部流程.png`,
  timeSync: `${WORK}/assets/Autoware官网-LiDAR相机时间同步.png`,
  collector: `${WORK}/assets/Autoware官网-图像投影融合消息收集流程.png`,
};

const LINKS = {
  overview: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
  roiCluster: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/',
  roiDetectedObject: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-detected-object-fusion/',
  roiPointcloud: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-pointcloud-fusion/',
  parameterSettings: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/#parameter-settings',
  collectorAlgorithm: 'https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/#inner-workings-algorithms',
  cameraInfo: 'https://github.com/ros2/common_interfaces/blob/humble/sensor_msgs/msg/CameraInfo.msg',
};

async function writeBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

async function imageBytes(path) {
  const bytes = await fs.readFile(path);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function parseSnapshot(snapshot) {
  return snapshot.ndjson
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function createEditor(presentation, records) {
  function find(slideNumber, name, kinds = ['textbox', 'shape', 'image']) {
    const rec = records.find(
      (item) => item.slide === slideNumber && item.name === name && kinds.includes(item.kind),
    );
    if (!rec) throw new Error(`Missing editable object on slide ${slideNumber}: ${name}`);
    return presentation.resolve(rec.id);
  }

  function text(slideNumber, name, nextText) {
    const target = find(slideNumber, name, ['textbox', 'shape']);
    const current = target.text?.toString?.() ?? '';
    // artifact-tool's cross-paragraph replace only updates the first matching run.
    // Use set() whenever either side is multi-line so inherited text cannot leak through.
    if (current && !current.includes('\n') && !nextText.includes('\n')) {
      target.text.replace(current, nextText);
    }
    else target.text.set(nextText);
    return target;
  }

  function textWithLink(slideNumber, name, prefix, linkLabel, uri, linkColor = '#0284C7') {
    const target = find(slideNumber, name, ['textbox', 'shape']);
    target.text.set([
      [
        { run: prefix },
        {
          run: linkLabel,
          textStyle: { bold: true, underline: 'sng', color: linkColor },
          link: { uri, isExternal: true },
        },
      ],
    ]);
    return target;
  }

  async function image(slideNumber, name, assetPath, alt, frame) {
    const target = find(slideNumber, name, ['image']);
    await target.replace({
      blob: await imageBytes(assetPath),
      contentType: 'image/png',
      alt,
      fit: 'contain',
    });
    target.fit = 'contain';
    target.crop = { left: 0, top: 0, right: 0, bottom: 0 };
    if (frame) target.frame = frame;
    return target;
  }

  async function uniqueImage(slideNumber, name, assetPath, alt, frame) {
    const target = find(slideNumber, name, ['image']);
    const slide = presentation.slides.getItem(slideNumber - 1);
    const nextFrame = frame ?? target.frame;
    const replacement = slide.images.add({
      blob: await imageBytes(assetPath),
      contentType: 'image/png',
      alt,
      fit: 'contain',
      position: nextFrame,
      geometry: target.geometry,
      borderRadius: target.borderRadius,
    });
    replacement.name = target.name;
    replacement.crop = { left: 0, top: 0, right: 0, bottom: 0 };
    target.delete();
    return replacement;
  }

  function remove(slideNumber, names) {
    for (const name of names) find(slideNumber, name, ['textbox', 'shape']).delete();
  }

  return { find, text, textWithLink, image, uniqueImage, remove };
}

function setNotes(presentation, slideNumber, noteText) {
  const slide = presentation.slides.getItem(slideNumber - 1);
  slide.speakerNotes.textFrame.setText(noteText);
  slide.speakerNotes.setVisible(true);
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(STARTER));
const before = await presentation.inspect({
  kind: 'slide,textbox,shape,image,notes',
  include: 'id,slide,name,title,text,textPreview,bbox',
  maxChars: 200000,
});
await fs.writeFile(`${WORK}/starter-before-edit.ndjson`, before.ndjson, 'utf8');
const records = parseSnapshot(before);
const edit = createEditor(presentation, records);

// Slide 1 — cover
edit.text(1, '矩形 15', '组会学习汇报 · 2026.08.19');
edit.text(1, 'cover-title', 'Autoware 相机—LiDAR\n投影融合');
edit.text(1, '矩形 5', 'CAMERA');
edit.text(1, '矩形 6', '2D ROI\n类别与语义');
edit.text(1, '矩形 8', 'LiDAR');
edit.text(1, '矩形 9', '3D\n位置与形状');
edit.text(1, '矩形 11', 'FUSION');
edit.text(1, '矩形 12', '投影并匹配\n同一目标');
edit.text(1, '矩形 14', '承接 03/04：从接口选择走到空间、时间与 ROI 匹配 · 蓝色 ↗ 可点击');
setNotes(
  presentation,
  1,
  [
    '本次汇报承接上一版 LiDAR 输出层级，聚焦一次相机—LiDAR 投影融合怎样发生。当前结论来自官方文档与接口梳理，不代表已经在组内工程或实车上跑通。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
    '- Local note: 50_智能驾驶/01_基础概念/03_LiDAR 输出与相机融合接口.md',
    '- Local note: 50_智能驾驶/01_基础概念/04_相机—LiDAR 投影融合.md',
  ].join('\n'),
);

// Slide 2 — two branches
edit.text(2, 'slide-2-eyebrow', 'FROM TWO BRANCHES');
edit.text(2, 'slide-2-title', '融合的是两条感知分支，不是两份原始数据');
edit.text(2, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(2, '矩形 4', '02');
edit.text(2, '矩形 5', 'LiDAR 侧已经形成 3D 结果，相机侧已经形成带类别的 2D ROI。');
edit.text(2, '矩形 7', 'CAMERA');
edit.text(2, '矩形 8', '相机分支：2D ROI');
edit.text(2, '矩形 9', '图像检测框与类别\n像素坐标中的区域\n还不能直接给出三维位置');
edit.text(2, '矩形 12', 'LiDAR');
edit.text(2, '矩形 13', 'LiDAR 分支：Msg3d');
edit.text(2, '矩形 14', 'PointCloud2 / 点簇 / 3D 目标\n位置、形状与点云\n类别可能未知或不稳定');
edit.text(2, '矩形 16', 'FUSION');
edit.text(2, '矩形 17', '是不是\n同一个目标？');
edit.text(2, '矩形 19', '先建立空间与时间对应，再把相机类别写回 LiDAR 的 3D 结果。');
setNotes(
  presentation,
  2,
  [
    '这里先建立统一直觉：Autoware 的投影融合处理的是 LiDAR 侧的 Msg3d 与相机侧的 RoIs。它们都已经是感知分支的结果，并带有各自时间戳。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
  ].join('\n'),
);

// Slide 3 — interface routing recap
edit.text(3, 'slide-7-eyebrow', 'INTERFACE ROUTING');
edit.text(3, 'slide-7-title', '先看 LiDAR 输出层级，再选择融合节点');
edit.text(3, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(3, '矩形 4', '03');
edit.text(3, '矩形 6', 'Apollo / 实例点簇');
edit.text(3, '矩形 7', '输出：DetectedObjectsWithFeature');
edit.text(3, '矩形 8', '字段：类别 · 置信度 · feature.cluster');
edit.textWithLink(3, '矩形 9', '→  ', 'roi_cluster_fusion ↗', LINKS.roiCluster, '#7C3AED');
edit.text(3, '矩形 11', 'CenterPoint / LiDAR TransFusion');
edit.text(3, '矩形 12', '输出：DetectedObjects');
edit.text(3, '矩形 13', '字段：类别 · 置信度 · 位姿 · 尺寸');
edit.textWithLink(3, '矩形 14', '→  ', 'roi_detected_object_fusion ↗', LINKS.roiDetectedObject, '#16A34A');
edit.text(3, '矩形 16', 'FRNet / 逐点语义');
edit.text(3, '矩形 17', '输出：PointCloud2');
edit.text(3, '矩形 18', '字段：x/y/z · class_id · probability');
edit.textWithLink(3, '矩形 19', '→  ', 'roi_pointcloud_fusion ↗', LINKS.roiPointcloud, '#0284C7');
edit.textWithLink(3, '矩形 44', '图源：Autoware 官方感知参考架构　', '↗ 官网文档', LINKS.overview);
setNotes(
  presentation,
  3,
  [
    '这页只做一次承接：选择融合节点时先看 LiDAR 侧对象已经形成到哪一步。实际工程仍要以 launch、remapping 和真实消息类型为准。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-detected-object-fusion/',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-pointcloud-fusion/',
  ].join('\n'),
);

// Slide 4 — spatial projection
edit.text(4, 'slide-5-eyebrow', 'STEP 01 · SPATIAL PROJECTION');
edit.text(4, 'slide-5-title', '投影分两步：外参换坐标，内参找像素');
edit.text(4, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(4, '矩形 4', '04');
edit.textWithLink(4, '矩形 7', '流程图：根据 Autoware 官方接口文档整理（非官网原图）　', '↗ 查看依据', LINKS.overview);
edit.text(4, '矩形 9', '外参决定从哪里看，内参决定落到哪个像素。');
edit.text(4, '矩形 10', '最小投影算例（教学示例）');
edit.text(4, '矩形 11', '下面数字只用于说明计算，不是实车标定值');
edit.text(4, '矩形 12', 'STEP 1 · TF / 外参');
edit.text(4, '矩形 13', 'P_C = R · P_L + t');
edit.text(4, '矩形 15', '假设变换后：\nP_C = (1.0, 0.5, 10.0) m');
edit.text(4, '矩形 16', '↓');
edit.textWithLink(4, '矩形 17', 'STEP 2 · ', 'CameraInfo / 内参 ↗', LINKS.cameraInfo, '#16A34A');
edit.text(4, '矩形 18', 'u=fx·X/Z+cx；v=fy·Y/Z+cy');
edit.text(4, '矩形 20', 'fx=fy=800，cx=640，cy=360\n→ 像素 (u,v)=(720,400)');
await edit.image(
  4,
  '图片 27',
  ASSETS.localOverview,
  '根据 Autoware 官方接口文档整理的相机与 LiDAR 投影融合中文总流程',
  { left: 66, top: 170, width: 670, height: 335 },
);
setNotes(
  presentation,
  4,
  [
    '教学算例先假设 TF 已把 LiDAR 点变换到相机坐标系 P_C=(1.0,0.5,10.0)m，再用 CameraInfo 中的内参计算像素。数值只帮助理解消息和公式，不是设备标定结果。左图为本地中文整理图，不是官网原图。',
    '',
    '[Sources]',
    '- https://github.com/ros2/common_interfaces/blob/humble/sensor_msgs/msg/CameraInfo.msg',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
    '- Local note: 50_智能驾驶/01_基础概念/04_相机—LiDAR 投影融合.md',
  ].join('\n'),
);

// Slide 5 — ROI matching
const roiEyebrow = edit.text(5, 'slide-4-eyebrow', 'STEP 02 · ROI MATCHING');
roiEyebrow.frame = { left: 64, top: 30, width: 600, height: 22 };
edit.text(5, 'slide-4-title', '匹配看重叠：投影区域与相机 ROI 是否对应');
edit.text(5, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(5, '矩形 4', '05');
edit.textWithLink(5, '矩形 9', '官方示意图：匹配成功后，才用相机类别更新 3D 点簇标签。　', '↗ 官网', LINKS.roiCluster, '#7C3AED');
edit.text(5, '矩形 10', 'roi_cluster_fusion 做什么');
edit.text(5, '矩形 11', '输入已经是 DetectedObjectsWithFeature 点簇');
edit.text(5, '矩形 12', 'MATCH');
edit.text(5, '矩形 13', '投影框 ↔ Camera ROI');
edit.text(5, '矩形 15', 'iou_x / iou_y\nroi_scale_factor · only_allow_inside_cluster');
edit.text(5, '矩形 16', '↓');
edit.text(5, '矩形 17', 'MATCHED OUTPUT');
edit.text(5, '矩形 18', '保留 3D 点簇');
edit.text(5, '矩形 20', '相机 ROI：CAR\n→ 更新 cluster 的分类标签\n位置与形状仍来自 LiDAR');
await edit.image(
  5,
  '图片 27',
  ASSETS.roiMatch,
  'Autoware roi_cluster_fusion 官方示意图：点簇投影区域与相机 ROI 的匹配',
);
setNotes(
  presentation,
  5,
  [
    'roi_cluster_fusion 把点簇投到图像，与相机检测 ROI 比较重叠，再用匹配到的 ROI 类别更新点簇标签。页面参数只用于说明应该在代码和配置中搜索什么，不代表当前工程取值。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/',
    '- Figure reproduced from https://raw.githubusercontent.com/autowarefoundation/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/images/roi_cluster_fusion.png',
  ].join('\n'),
);

const oldS7OverlayNames = [
  '矩形 21',
  '圆角矩形 24', '矩形 25',
  '圆角矩形 26', '矩形 27',
  '圆角矩形 28', '矩形 29',
  '圆角矩形 30', '矩形 31',
  '圆角矩形 32', '矩形 33', '矩形 34',
  '圆角矩形 35', '矩形 36', '矩形 37',
  '圆角矩形 38', '矩形 39', '矩形 40',
  '圆角矩形 41', '矩形 42', '矩形 43',
];

// Slide 6 — internal pipeline
edit.text(6, 'slide-7-eyebrow', 'STEP 02 · ROI CLUSTER FUSION');
edit.text(6, 'slide-7-title', 'roi_cluster_fusion：投影、匹配、更新标签');
edit.text(6, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(6, '矩形 4', '06');
edit.text(6, '矩形 6', 'PRE-PROCESS');
edit.text(6, '矩形 7', '点簇变换到相机坐标');
edit.text(6, '矩形 8', '投影得到 2D 区域');
edit.text(6, '矩形 9', '→  准备匹配');
edit.text(6, '矩形 11', 'FUSION PROCESS');
edit.text(6, '矩形 12', '比较 ROI 与投影区域');
edit.text(6, '矩形 13', 'IoU / 阈值过滤');
edit.text(6, '矩形 14', '→  选择匹配标签');
edit.text(6, '矩形 16', 'POST-PROCESS');
edit.text(6, '矩形 17', '处理 UNKNOWN 与重叠');
edit.text(6, '矩形 18', '保留 LiDAR 的 3D 结构');
edit.text(6, '矩形 19', '→  输出融合点簇');
edit.textWithLink(6, '矩形 44', '图源：Autoware Universe 官方文档 · roi_cluster_fusion pipeline　', '↗ 官网', LINKS.roiCluster);
edit.remove(6, oldS7OverlayNames);
await edit.uniqueImage(
  6,
  '图片 68',
  ASSETS.roiPipeline,
  'Autoware roi_cluster_fusion 官方内部处理流水线',
  { left: 500, top: 166, width: 710, height: 390 },
);
setNotes(
  presentation,
  6,
  [
    '官方流程图把 roi_cluster_fusion 拆成预处理、融合和后处理。汇报时只抓住三件事：先投影，再匹配，最后更新标签并输出仍带点簇的 3D 结果。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/',
    '- Figure reproduced from https://raw.githubusercontent.com/autowarefoundation/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/images/roi_cluster_fusion_pipeline.svg',
  ].join('\n'),
);

// Slide 7 — time alignment
const timeEyebrow = edit.text(7, '矩形 16', 'STEP 03 · TIME ALIGNMENT');
timeEyebrow.frame = { left: 64, top: 30, width: 600, height: 22 };
edit.text(7, 'slide-6-title', '空间对齐还不够：ROI 与 Msg3d 必须来自相近时刻');
edit.text(7, '矩形 2', '组会学习汇报 · 2026.08.19');
edit.text(7, '矩形 3', '07');
edit.textWithLink(7, '矩形 6', '图源：Autoware Universe 官方文档 · lidar_camera_sync.svg　', '↗ 官网', LINKS.parameterSettings);
edit.text(7, '矩形 8', '目标在运动，时间差会把正确投影变成错位。');
edit.text(7, '矩形 9', '时间偏移怎么处理');
edit.text(7, '矩形 10', '每个相机快门时刻都可能与 LiDAR header 不同');
edit.text(7, '矩形 12', 'rois_timestamp_offsets\n补偿 Camera header 与 LiDAR header 的时间差');
edit.text(7, '矩形 13', '↓');
edit.text(7, '矩形 15', 'matching_strategy.threshold\n只在允许时间窗口内匹配\n\nrois_timeout_sec / msg3d_timeout_sec\n输入不齐时触发等待或超时策略');
await edit.image(
  7,
  '图片 22',
  ASSETS.timeSync,
  'Autoware 官方 LiDAR 扫描与多相机快门时间偏移示意图',
  { left: 175, top: 170, width: 450, height: 340 },
);
setNotes(
  presentation,
  7,
  [
    '即使外参和内参正确，运动目标仍会因为传感器时刻不同而错位。Autoware 用每路 rois_timestamp_offsets、匹配时间窗口和超时参数把 RoIs 与 Msg3d 对齐到相近参考时刻。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/#parameter-settings',
    '- Figure reproduced from https://raw.githubusercontent.com/autowarefoundation/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/images/lidar_camera_sync.svg',
  ].join('\n'),
);

// Slide 8 — Collector
edit.text(8, 'slide-7-eyebrow', 'STEP 04 · MESSAGE COLLECTION');
edit.text(8, 'slide-7-title', 'Collector 先对齐时间，再触发一次融合');
edit.text(8, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(8, '矩形 4', '08');
edit.text(8, '矩形 6', 'REFERENCE TIME');
edit.text(8, '矩形 7', 'Msg3d 或 ROI 到达');
edit.text(8, '矩形 8', '先减去配置的 offset');
edit.text(8, '矩形 9', '→  得到 reference timestamp');
edit.text(8, '矩形 11', 'COLLECTOR');
edit.text(8, '矩形 12', '查找同一参考时刻的容器');
edit.text(8, '矩形 13', '没有就创建并启动 timer');
edit.text(8, '矩形 14', '→  收集多相机 ROI + 3D');
edit.text(8, '矩形 16', 'FUSE / TIMEOUT');
edit.text(8, '矩形 17', '数据齐全就执行融合');
edit.text(8, '矩形 18', '超时仍缺 Msg3d 则丢弃');
edit.text(8, '矩形 19', '→  发布结果并回到 idle');
edit.textWithLink(8, '矩形 44', '图源：Autoware Universe 官方文档 · fusion_algorithm　', '↗ 官网', LINKS.collectorAlgorithm);
edit.remove(8, oldS7OverlayNames);
await edit.uniqueImage(
  8,
  '图片 68',
  ASSETS.collector,
  'Autoware 官方 Collector 与图像投影融合消息收集流程',
  { left: 500, top: 166, width: 710, height: 390 },
);
setNotes(
  presentation,
  8,
  [
    'Collector 以修正后的 reference timestamp 为键收集 Msg3d 与多路相机 RoIs。数据齐全时融合；定时器到期时按现有数据和 Msg3d 是否存在决定融合或丢弃。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/#inner-workings-algorithms',
    '- Figure reproduced from https://raw.githubusercontent.com/autowarefoundation/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/images/fusion_algorithm.drawio.svg',
  ].join('\n'),
);

// Slide 9 — end-to-end illustrative example
edit.text(9, 'slide-2-eyebrow', 'END-TO-END EXAMPLE');
edit.text(9, 'slide-2-title', '一辆车融合后：三维几何保留，类别被补全');
edit.text(9, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(9, '矩形 4', '09');
edit.text(9, '矩形 5', '以下数值只用于说明信息怎样流动，不是实测输出。');
edit.text(9, '矩形 7', 'CAMERA');
edit.text(9, '矩形 8', '相机：图像 ROI');
edit.text(9, '矩形 9', 'ROI=(620,300,180,120)\nclassification=car\n只知道像素区域与类别');
edit.text(9, '矩形 12', 'LiDAR');
edit.text(9, '矩形 13', 'LiDAR：3D 目标');
edit.text(9, '矩形 14', 'pos≈(12.0,1.5,0.0)m\nshape≈(4.5,1.8,1.6)m\n类别可能 UNKNOWN');
edit.text(9, '矩形 16', 'MATCH');
edit.text(9, '矩形 17', 'TF + K\n+ IoU');
edit.text(9, '矩形 19', '融合输出：前方约 12 m 处有一辆 car；位置和形状仍来自 LiDAR。');
setNotes(
  presentation,
  9,
  [
    '这个例子把整条链串起来：LiDAR 给三维位置和形状，相机给 car 类别；经过 TF、CameraInfo 投影和 IoU 匹配后，融合结果仍是 3D 目标，只是类别被补全。所有数字都是解释性示例。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
    '- Local note: 50_智能驾驶/01_基础概念/04_相机—LiDAR 投影融合.md',
  ].join('\n'),
);

// Slide 10 — close with verification boundary
edit.text(10, 'slide-11-eyebrow', 'CURRENT STATE → NEXT EVIDENCE');
edit.text(10, 'slide-11-title', '流程已经按官网梳理，实机融合仍待验证');
edit.text(10, '矩形 3', '组会学习汇报 · 2026.08.19');
edit.text(10, '矩形 4', '10');
edit.text(10, '矩形 5', '已完成');
edit.text(10, '矩形 8', '消息层级与三个 roi_* 节点');
edit.text(10, '矩形 10', '外参 / CameraInfo 的投影关系');
edit.text(10, '矩形 12', 'ROI 匹配与 Collector 时间逻辑');
edit.text(10, '矩形 15', '待验证');
edit.text(10, '矩形 18', '实际 Topic、launch 与 remapping');
edit.text(10, '矩形 20', 'TF / CameraInfo 是否齐全');
edit.text(10, '矩形 22', 'header 时间与 timestamp offset');
edit.text(10, '矩形 24', 'debug 图像和 /diagnostics');
edit.text(10, '矩形 26', '先验证 TF、CameraInfo 与时间戳，再讨论融合效果。');
setNotes(
  presentation,
  10,
  [
    '结尾明确边界：已经完成的是官方流程和接口理解；未完成的是组内工程与实机验证。下一步应拿到真实 launch 或 rosbag，依次核对 Topic 类型、TF、CameraInfo、header 时间、offset、debug 图像和 diagnostics。',
    '',
    '[Sources]',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/',
    '- https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/',
  ].join('\n'),
);

const after = await presentation.inspect({
  kind: 'slide,textbox,shape,image,notes',
  include: 'id,slide,name,title,text,textPreview,textChars,textLines,bbox,alt',
  maxChars: 240000,
});
await fs.writeFile(`${WORK}/after-edit-before-export.ndjson`, after.ndjson, 'utf8');

const exported = await PresentationFile.exportPptx(presentation);
await exported.save(FINAL);

// Re-import the exported PPTX so final QA is performed on the actual deliverable.
const finalPresentation = await PresentationFile.importPptx(await FileBlob.load(FINAL));
const renderDir = `${WORK}/final-render`;
const layoutDir = `${WORK}/final-layout/final`;
await fs.mkdir(renderDir, { recursive: true });
await fs.mkdir(layoutDir, { recursive: true });

for (const [index, slide] of finalPresentation.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, '0')}`;
  await writeBlob(`${renderDir}/${stem}.png`, await finalPresentation.export({ slide, format: 'png', scale: 1 }));
  const layout = await slide.export({ format: 'layout' });
  await fs.writeFile(`${layoutDir}/${stem}.layout.json`, await layout.text(), 'utf8');
}

await writeBlob(
  `${WORK}/final-montage.webp`,
  await finalPresentation.export({ format: 'webp', montage: true, scale: 1 }),
);

const finalInspect = await finalPresentation.inspect({
  kind: 'deck,slide,textbox,shape,image,notes,layout',
  include: 'id,slide,name,title,text,textPreview,textChars,textLines,bbox,alt,isPlaceholder,placeholders',
  maxChars: 260000,
});
await fs.writeFile(`${WORK}/final-inspect.ndjson`, finalInspect.ndjson, 'utf8');
await fs.writeFile(`${WORK}/final-path.txt`, FINAL, 'utf8');
console.log(FINAL);
