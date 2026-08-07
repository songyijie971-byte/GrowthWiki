# Obsidian Vault

这是我的 Obsidian 主知识库，仓库根目录为：

```text
D:\Data\GraduateWorkspace\01_ObsidianVault
```

当前仓库已连接到 GitHub：

```text
https://github.com/songyijie971-byte/GrowthWiki.git
```

## 知识库结构

- `Home.md`：知识库主页和当前学习入口。
- `10_ROS2/`：ROS 2 学习地图、常用指令、概念卡片和学习记录。
- `20_Research/`：研究方向和研究日志。
- `30_Papers/`：论文索引。
- `40_Wiki_AI/`：AI 辅助整理内容。
- `50_智能驾驶/`：LiDAR、Autoware 和视觉-LiDAR 融合资料。
- `90_Templates/`：笔记模板。
- [[GitHub同步说明]]：Git、GitHub 和 Obsidian Git 插件的同步说明。

## 日常同步

在 Obsidian 中修改笔记后，可以使用 Obsidian Git 插件，或在 PowerShell 中执行：

```powershell
Set-Location D:\Data\GraduateWorkspace\01_ObsidianVault
git pull --rebase
git add .
git commit -m "update notes"
git push
```

如果主要更新 ROS 2 笔记，可以使用：

```powershell
git add .
git commit -m "update ROS2 notes"
git push
```

## 同步边界

以下本地工具和临时目录不会提交到 GitHub：

- `.agents/`
- `.codex/`
- `.codex_tmp/`
- `tmp/`
- `.obsidian/workspace.json`

笔记、图片、知识图谱 Canvas、模板和组会汇报文件会随仓库同步。

## 协作提醒

- 换电脑或另一台电脑修改前，先执行 `git pull --rebase`。
- 不要同时在两台电脑离线大量修改同一篇笔记。
- 如果出现冲突副本，先手动对比，再删除或合并。
- 覆盖前的旧版远端保存在分支 `backup-before-obsidian-vault-overwrite-20260807`。
