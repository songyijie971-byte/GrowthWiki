# CLAUDE.md

## Role

Claude Code 是 GrowthWiki 的长期读取者和维护者。

本知识库是 Obsidian-first 的本地 Markdown 知识库。Obsidian 负责浏览、编辑双链和查看 Graph View；Claude Code 负责读取、总结、查询、链接和更新 Markdown。

Codex 只负责首次初始化，不是长期维护者。

## Scope

GrowthWiki 只收纳以下内容：

- 已读论文/文献整理笔记
- 已读技术文档整理笔记
- 项目技术资料和项目知识沉淀
- 能连接论文与技术文档的概念

默认不收纳：

- 导师资料
- 职业规划
- 个人成长
- 情绪复盘
- 生活记录
- 未读收藏夹

## Query Rule

回答知识库相关问题时，优先读取本地 Markdown。

读取顺序：

1. `99_Maps/index.md`
2. `99_Maps/main-map.md`
3. `99_Maps/paper-map.md`
4. `99_Maps/tech-map.md`
5. `03_Concepts/concept-map.md`

如果 map 不足，再搜索：

- `01_Papers/`
- `02_TechDocs/`
- `03_Concepts/`
- `04_Projects/`

## Answer Format

回答时必须区分：

- `Knowledge Base`：知识库已有明确内容。
- `Inference`：基于知识库内容做出的推断。
- `Missing`：知识库没有明确记录的信息。

如果知识库没有明确内容，不要编造。应直接标注 `Missing`，并说明需要补充哪些资料。

查询结果尽量引用具体 Markdown 文件名。

## Document Intake Protocol

当用户把 PDF/DOCX/Markdown 文档放入 `00_Inbox/` 后：

1. 读取 `00_Inbox/intake.md`。
2. 如果原文是 PDF/DOCX，从 `00_Inbox/raw/` 读取。
3. 判断资料类型：
   - 论文/文献 -> `01_Papers/`
   - 技术文档 -> `02_TechDocs/`
   - 项目技术资料 -> `04_Projects/`
4. 按对应模板生成结构化 Markdown 笔记。
5. 生成短知识主题文件名，不直接复制 PDF/DOCX 原始文件名或公众号标题。
6. 在笔记 `Metadata` 中保留 `节点标题`、`原始标题`、`原文位置`、`来源`、`阅读日期`、`状态`。
7. 提取关键概念。
8. 检查 `03_Concepts/` 是否已有对应概念页。
9. 已有概念页则添加双链。
10. 没有概念页时，只有概念足够具体、可复用、能连接论文和技术文档，才创建新概念页。
11. 更新相关 map：
   - `99_Maps/paper-map.md`
   - `99_Maps/tech-map.md`
   - `03_Concepts/concept-map.md`
   - `04_Projects/project-map.md`
12. 输出新增文件、更新文件、建立的双链、仍然缺失的信息。

## Node Naming Rule

Obsidian Graph View 显示的是 Markdown 文件名，所以文件名必须是干净的知识节点。

处理技术文档时：

1. 先判断资料核心主题。
2. 生成短文件名：`主题-方法/对象/用途.md`。
3. 不直接复制 PDF/DOCX 原始文件名。
4. 不直接使用公众号标题、宣传标题或长句标题。
5. 原始标题写入 `Metadata` 的 `原始标题` 字段。
6. 节点标题写入 `Metadata` 的 `节点标题` 字段。
7. 如果不确定命名，优先选择保守短名，并在处理结果中标注可改名建议。

推荐：

```text
LBM多任务灵巧操作评估.md
PRTS-VLA目标可达性.md
MuJoCo-IsaacSim仿真环境对比.md
```

不推荐：

```text
Science Robotics封面研究：近5万次测试，定义多任务灵巧操作的真实边界.md
TeleAI最新PRTS基座模型：把目标感写进VLA，让机器人知道距离目标还差多远.md
```

## Shortcut Commands

用户不需要每次重复完整流程。

当用户使用以下短句时，直接按 `Document Intake Protocol` 执行：

- `处理待处理资料`
- `处理 intake`
- `处理 00_Inbox/intake.md`
- `处理 intake 里的第一条`
- `处理 intake 里的全部待处理资料`
- `把 raw 里的 PDF 编译进知识库`
- `把这篇论文放进知识库`
- `把这个技术文档放进知识库`

执行前先读取：

1. `CLAUDE.md`
2. `00_Inbox/intake.md`
3. `99_Maps/index.md`
4. `99_Maps/main-map.md`

如果 `intake.md` 中的文件名和 `00_Inbox/raw/` 中的原文无法对应，先指出缺失文件，不要编造。

## PDF/DOCX Rule

- PDF/DOCX 原文只作为临时输入。
- 长期可查知识必须转成 Markdown。
- `01_Papers/`、`02_TechDocs/`、`04_Projects/` 不长期保存 PDF/DOCX 原文。
- 如果文档只在 `00_Inbox/raw/`，尚未转成 Markdown，查询时应标记为 `Missing` 或“尚未编译进知识库”。

## Linking Rule

- 每篇论文建议链接 2-5 个概念。
- 每篇技术文档建议链接 1-3 个概念。
- 项目页应链接相关论文、技术文档和概念。
- 概念页负责连接论文和技术文档。
- 模板中的示例名称不要写成 Obsidian 双链，避免生成假节点。
- Graph View 是双链自然连接后的结果，不为了图谱好看创建空页。

## Graph View Rule

默认 Obsidian 关系图谱只展示三类真实知识节点：

- `01_Papers/`：论文/文献笔记。
- `02_TechDocs/`：技术文档笔记。
- `03_Concepts/`：具体、可复用、能连接资料的概念页。

以下内容是维护节点或输入节点，不进入默认关系图谱：

- `00_Inbox/` 和 `00_Inbox/raw/`
- `04_Projects/`
- `05_Graph/`
- `99_Maps/`
- 根目录 `README.md`、`CLAUDE.md`、`AGENTS.md`
- `intake.md`
- `concept-map.md`
- `paper-template.md`、`techdoc-template.md`、`concept-template.md`、`project-template.md`
- 各类 map、guide、dashboard、filter、linking-rules 说明页

当用户提供 raw 文档时，先把原文编译成对应的真实知识 Markdown；默认关系图谱只应看到新产生的论文节点、技术文档节点和相关概念节点，不应看到 raw、README、模板、map 或图谱说明文件。

如果需要调整 Obsidian 默认图谱，保持 `.obsidian/graph.json` 的过滤器语义为：

```text
(path:01_Papers OR path:02_TechDocs OR path:03_Concepts) -path:README -path:paper-template -path:techdoc-template -path:concept-template -path:concept-map
```

## Maintenance Rule

- 优先更新已有页面。
- 不创建空概念页。
- 不创建过泛概念页。
- 不新增计划外复杂目录。
- 不创建 `schema/`、`outputs/`、`workflow/`、`synthesis/`。
- 不删除用户资料。
