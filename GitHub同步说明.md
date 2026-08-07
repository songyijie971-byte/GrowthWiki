# Git 与 GitHub 同步说明

这份说明专门记录本 Obsidian 知识库的 Git/GitHub 同步方式，不属于 ROS 2 知识内容。

## 同步链路

```text
Obsidian 本地知识库 -> Git 版本管理 -> GitHub 云端备份
```

## 先检查仓库状态

在 PowerShell 中进入知识库根目录：

```powershell
Set-Location D:\Data\GraduateWorkspace\01_ObsidianVault
git status
git remote -v
```

当前目录已经初始化为 Git 仓库，并已连接 `https://github.com/songyijie971-byte/GrowthWiki.git`。当前 `main` 已同步到 GitHub；覆盖前的远端旧版保存在 `backup-before-obsidian-vault-overwrite-20260807` 分支。

## 日常同步

修改笔记后：

```powershell
Set-Location D:\Data\GraduateWorkspace\01_ObsidianVault
git add .
git commit -m "update notes"
git push
```

如果主要更新 ROS 2 笔记：

```powershell
git add .
git commit -m "update ROS2 notes"
git push
```

换电脑，或另一台电脑也修改过这个知识库时，先同步远端历史：

```powershell
Set-Location D:\Data\GraduateWorkspace\01_ObsidianVault
git pull --rebase
git add .
git commit -m "update notes"
git push
```

每次修改都会保留 Git 历史，可以在 GitHub 或本地回看、比较和恢复旧版本。

## 要不要安装 Obsidian CLI？

不用把 Obsidian CLI 当成 Git 插件。Obsidian CLI 是 Obsidian 官方提供的命令行接口，用来从终端读取、搜索、创建和操作笔记；它不负责替代 Git，也不会自动把仓库连接到 GitHub。

当前官方安装方式是：

1. 将 Obsidian 更新到 1.12 安装器版本（当前官方页面列为 1.12.7+）。
2. 打开 **Settings -> General**。
3. 启用 **Command line interface**，按提示注册 `obsidian` 命令。

Obsidian CLI 需要 Obsidian 桌面应用运行。普通 Git/GitHub 同步不依赖 Obsidian CLI；只要电脑安装 Git、仓库已初始化并关联 GitHub，就可以直接使用上面的 PowerShell 命令。

## 要不要安装 Obsidian Git 插件？

`Obsidian Git` 是可选的社区插件，可以在 Obsidian 内提供提交、拉取、推送、历史和自动同步界面。它不是使用 GitHub 的必需品。

当前建议先掌握命令行 Git 流程；以后如果希望在 Obsidian 内点击操作，再安装 `Obsidian Git`。不要同时让插件和手动脚本在没有确认的情况下自动推送，以免产生难以理解的提交或冲突。

## 相关资料

- [Obsidian CLI 官方说明](https://obsidian.md/help/cli)
- [Obsidian Git 插件](https://github.com/Vinzent03/obsidian-git)
