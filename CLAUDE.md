# Obsidian 知识库项目说明

本项目的既有知识库维护规则位于 `AGENTS.md`。其中关于目录结构、笔记内容、命名、Metadata、Obsidian 双链、图谱、Map 和资料处理的具体规定优先于本文件；执行任务前必须先阅读并遵守该文件。

# Agent Team 工作规则

## 默认团队

本项目是Obsidian知识库，而不是普通软件代码项目。

当任务适合使用Agent Team时，默认使用：

- knowledge-researcher
- knowledge-curator
- knowledge-reviewer

不要默认使用用户级通用：

- researcher
- developer
- reviewer

除非任务本身涉及脚本开发、插件开发、代码调试或用户明确要求。

## 默认协作流程

Team Lead
↓
knowledge-researcher
负责检索现有知识和阅读来源

knowledge-curator
负责创建或修改Markdown知识节点

knowledge-reviewer
负责独立审查来源一致性、链接、重复和遗漏

典型流程：

1. Team Lead拆解任务。
2. knowledge-researcher优先调查已有内容和来源。
3. knowledge-curator根据确认材料进行整理。
4. knowledge-reviewer独立检查。
5. 若reviewer发现Major或Critical问题，交回curator修改。
6. Team Lead最后汇总。

可以并行的任务应尽量并行，但不要让多个Agent同时修改同一个Markdown文件。

## 知识库原则

- 所有知识内容使用中文Markdown。
- 只收纳已经阅读或实际处理过的资料。
- 不创建空页。
- 不编造来源没有的信息。
- 缺失信息标记Missing。
- 新建节点前先检查是否已有相同或高度重叠节点。
- 论文、技术文档、概念和项目之间通过自然知识关系连接。
- 双链应服务于知识检索，不追求数量。
- 修改后检查对应导航和Map是否需要同步更新。
