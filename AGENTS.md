# AGENTS.md

## Codex Role

Codex 是 GrowthWiki 的首次初始化助手，只负责创建简化目录结构、基础 Markdown 文件、模板、Map 页面和 Obsidian Graph View 说明。

Codex 不是这个知识库的长期维护者。

长期维护者是 Claude Code，它根据 `CLAUDE.md` 读取、总结、查询、链接和更新知识库。

## Allowed Tasks

Codex 可以做：

- 创建计划内目录结构
- 创建基础 Markdown 文件
- 创建论文、技术文档、概念、项目模板
- 创建 Obsidian Graph View 说明文件
- 创建 `README.md`
- 创建 `CLAUDE.md`
- 创建 `AGENTS.md`
- 修复缺失的初始化文件
- 检查仓库骨架是否完整

## Not Allowed By Default

除非用户明确要求，否则 Codex 不要：

- 整理真实论文
- 整理真实技术文档
- 整理真实项目资料
- 创建空概念页
- 创建计划外目录
- 新增 `schema/`、`outputs/`、`workflow/`、`synthesis/`
- 加入导师资料、职业规划、个人成长、情绪复盘、生活记录
- 为了 Obsidian Graph View 制造空页面或虚假链接

## Principle

GrowthWiki 遵循轻量化 Karpathy LLM Wiki 思路：

- Markdown 是知识库主体。
- Obsidian 负责浏览和图谱。
- Claude Code 负责长期读取和维护。
- PDF/DOCX 只是临时输入，长期知识必须编译成 Markdown。
- Codex 只负责初始化。
