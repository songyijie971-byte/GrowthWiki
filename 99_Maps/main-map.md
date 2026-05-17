# Main Map

GrowthWiki 是一个 Obsidian-first、Claude Code direct-read 的本地 Markdown 知识库。

## 结构

- `00_Inbox/`：临时输入，不是长期知识层。
- `01_Papers/`：论文/文献整理笔记。
- `02_TechDocs/`：技术文档整理笔记。
- `03_Concepts/`：论文和技术文档之间的桥。
- `04_Projects/`：项目技术沉淀。
- `05_Graph/`：Graph View 使用规则。
- `99_Maps/`：人和 Claude Code 的导航入口。

## 关系

论文和技术文档不强行混合。

它们通过 `03_Concepts/` 中的概念页自然连接：

```text
论文笔记 -> 概念页 <- 技术文档笔记
                 ^
                 |
               项目页
```

## 原则

- 不堆未读资料。
- 不保存空概念页。
- 不为了 Graph View 创建虚假链接。
- 不把 PDF/DOCX 原文当成长期知识页。
- Claude Code 查询时必须优先读取本地 Markdown。
