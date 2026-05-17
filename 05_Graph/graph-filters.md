# Graph Filters

这里记录 Obsidian Graph View 的常用过滤器。

## 默认推荐图谱

```text
(path:01_Papers OR path:02_TechDocs OR path:03_Concepts) -path:README -path:paper-template -path:techdoc-template -path:concept-template -path:concept-map
```

用途：默认只显示真实知识节点：论文笔记、技术文档笔记、概念页。

默认图谱不显示：

- `00_Inbox/`：临时入口和原始材料。
- `05_Graph/`：图谱说明和过滤器。
- `99_Maps/`：导航 map 页面。
- 根目录维护文件：`README.md`、`CLAUDE.md`、`AGENTS.md`。
- 各类模板、map、说明页，例如 `paper-template`、`techdoc-template`、`concept-template`、`concept-map`。

这些文件仍然属于知识库维护结构，只是不进入默认 Graph View。

## 干净图谱

```text
(path:01_Papers OR path:02_TechDocs OR path:03_Concepts) -path:README -path:paper-template -path:techdoc-template -path:concept-template -path:concept-map
```

用途：与默认图谱保持一致，避免 README、template、map、CLAUDE、AGENTS 等维护节点污染图谱。

## 最小核心图谱

```text
path:02_TechDocs OR path:03_Concepts -path:README -path:template
```

用途：当前阶段只看技术文档和概念之间的关系。

## 论文图谱

```text
path:01_Papers
```

用途：只看论文/文献笔记。

## 技术文档图谱

```text
path:02_TechDocs
```

用途：只看技术文档笔记。

## 概念桥图谱

```text
path:03_Concepts
```

用途：观察连接论文和技术文档的概念节点。

## 项目图谱

```text
path:04_Projects
```

用途：按需观察项目如何连接论文、技术文档和概念。项目页不进入默认图谱。

## 核心知识区

```text
path:01_Papers OR path:02_TechDocs OR path:03_Concepts
```

用途：查看默认核心知识区，不包含项目页、临时入口、说明文件、模板和 map。
