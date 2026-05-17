# GrowthWiki

GrowthWiki 是一个 Obsidian-first、Claude Code direct-read 的本地 Markdown 知识库。

它用于管理已读论文/文献、已读技术文档、项目技术沉淀，以及连接这些资料的可复用概念。

## 核心原则

- Obsidian 负责浏览、双链和 Graph View。
- Claude Code 后期直接读取 Markdown，减少回答幻觉。
- Codex 只负责首次初始化。
- PDF/DOCX 可以作为临时输入，但长期知识必须转成 Markdown。
- 不创建空概念页。
- 不为了图谱好看强行造链接。

## 目录结构

```text
D:\GrowthWiki
├─ 00_Inbox/
│  ├─ intake.md
│  └─ raw/
├─ 01_Papers/
│  ├─ README.md
│  └─ paper-template.md
├─ 02_TechDocs/
│  ├─ README.md
│  └─ techdoc-template.md
├─ 03_Concepts/
│  ├─ README.md
│  ├─ concept-map.md
│  └─ concept-template.md
├─ 04_Projects/
│  ├─ README.md
│  ├─ project-map.md
│  └─ project-template.md
├─ 05_Graph/
│  ├─ graph-guide.md
│  ├─ graph-filters.md
│  ├─ graph-linking-rules.md
│  └─ graph-dashboard.md
├─ 99_Maps/
│  ├─ index.md
│  ├─ main-map.md
│  ├─ paper-map.md
│  └─ tech-map.md
├─ CLAUDE.md
├─ AGENTS.md
└─ README.md
```

## 每个目录怎么用

### 00_Inbox

临时入口。

- `intake.md`：登记待处理资料。
- `raw/`：临时放 PDF/DOCX 原文。

这里不是长期知识层，不写日记、个人成长、情绪复盘或生活记录。

### 01_Papers

放论文/文献整理笔记。

不放 PDF 原文，不放未读收藏。每篇论文笔记应包含 `Problem`、`Method`、`Experiment`、`Conclusion`、`Useful For Me`、`Related Concepts`。

### 02_TechDocs

放技术文档整理笔记。

记录工具、框架、工程方法、使用方式和踩坑点。每篇技术文档笔记应包含 `What It Is`、`Core Ideas`、`How To Use`、`Engineering Notes`、`Common Pitfalls`、`Related Concepts`。

### 03_Concepts

放能连接论文和技术文档的概念。

只有概念来自真实资料，并且足够具体、可复用、能连接多份资料时，才创建概念页。

### 04_Projects

放项目技术资料和项目知识沉淀。

项目页可以连接论文、技术文档和概念。

### 05_Graph

服务 Obsidian Graph View。

- `graph-guide.md`：图谱使用说明。
- `graph-filters.md`：常用过滤器。
- `graph-linking-rules.md`：双链规则。
- `graph-dashboard.md`：图谱中心导航页。

### 99_Maps

人和 Claude Code 的导航入口。

- `index.md`：总入口。
- `main-map.md`：全库主地图。
- `paper-map.md`：论文导航。
- `tech-map.md`：技术文档导航。

## 放入一个 PDF/DOCX 后怎么处理

1. 把 PDF/DOCX 放入 `00_Inbox/raw/`。
2. 在 `00_Inbox/intake.md` 登记文件名、来源、类型和状态。
3. 让 Claude Code 按 `CLAUDE.md` 的 Document Intake Protocol 读取文档。
4. Claude Code 生成结构化 Markdown：
   - 论文/文献 -> `01_Papers/`
   - 技术文档 -> `02_TechDocs/`
   - 项目技术资料 -> `04_Projects/`
5. Claude Code 提取相关概念，必要时更新 `03_Concepts/`。
6. Claude Code 更新 `99_Maps/` 和相关 map。
7. Obsidian Graph View 会根据双链自然显示连接。

## 给 Claude Code 的最短说法

不用每次写长 prompt。

如果你已经把文件放进 `00_Inbox/raw/`，并且在 `00_Inbox/intake.md` 登记好了，可以直接对 Claude Code 说：

```text
处理 intake 里的全部待处理资料。
```

或者：

```text
处理 intake 里的第一条。
```

更具体一点也可以：

```text
把 raw 里的 PDF 编译进知识库。
```

Claude Code 应按 `CLAUDE.md` 自动完成：读取原文、生成 Markdown 笔记、提取概念、建立双链、更新 map，并汇报 `Knowledge Base / Inference / Missing`。

## Claude Code 查询方式

Claude Code 回答知识库相关问题时，应优先读取：

- `99_Maps/index.md`
- `99_Maps/main-map.md`
- `99_Maps/paper-map.md`
- `99_Maps/tech-map.md`
- `03_Concepts/concept-map.md`

回答时区分：

- `Knowledge Base`：知识库明确已有内容。
- `Inference`：基于知识库做出的推断。
- `Missing`：知识库暂时没有的信息。

如果知识库没有明确内容，不要编造。

## Obsidian 使用

用 Obsidian 打开：

```text
D:\GrowthWiki
```

推荐先打开：

- `99_Maps/使用说明.md`
- `99_Maps/index.md`
- `99_Maps/main-map.md`
- `05_Graph/graph-dashboard.md`

## Graph View 过滤器

常用过滤器见：

- [[05_Graph/graph-filters]]

推荐：

```text
-path:00_Inbox
```

```text
path:01_Papers OR path:02_TechDocs OR path:03_Concepts OR path:04_Projects
```

## 不放入本库的内容

- 导师资料
- 职业规划
- 个人成长
- 情绪复盘
- 生活记录
- 未读收藏夹
- 为图谱效果创建的空页面
