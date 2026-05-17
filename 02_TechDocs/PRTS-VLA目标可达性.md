# PRTS-VLA目标可达性

## Metadata

- 类型：技术文档
- 节点标题：PRTS-VLA目标可达性
- 原始标题：TeleAI最新PRTS基座模型：把"目标感"写进VLA，让机器人知道距离目标"还差多远"
- 原文位置：00_Inbox/raw/TeleAI最新PRTS基座模型：把"目标感"写进VLA，让机器人知道距离目标"还差多远".pdf
- 阅读日期：2026-05-17
- 状态：已整理
- 来源：公众号，2026年5月15日
- 论文链接：https://arxiv.org/abs/2604.27472
- 模型链接：https://huggingface.co/TeleEmbodied/PRTS-4B
- 代码链接：https://github.com/TeleHuman/PRTS

## What It Is

PRTS（Primitive Reasoning and Tasking System）是TeleAI提出的VLA（Vision-Language-Action）基座模型，旨在解决VLA模型中的"Goal Reachability Unawareness"（目标可达性无意识）问题。这是一个4B参数的VLA模型，通过引入课程强化学习（CRL）来提升机器人的推理能力。

## Core Ideas

### 核心问题

VLA模型存在"目标可达性无意识"问题：
- 模型不知道距离目标还有多远
- 缺乏对目标可达性的判断能力
- 导致在复杂任务中表现不佳

### 解决方案

PRTS通过以下方式解决这个问题：

1. **课程强化学习（CRL）**：
   - 引入Q值函数来评估目标可达性
   - 通过课程学习逐步提升任务难度
   - 训练过程中动态调整学习策略

2. **Token设计**：
   - 引入`<CRL_action>`和`<CRL_goal>`特殊token
   - Auto-Regressive方式生成动作序列
   - 实现动作和目标的解耦

3. **训练策略**：
   - 使用167B tokens进行训练
   - 数据来自AgiBotWorld、RoboMind、Open X-Embodiment等多个数据集
   - 使用FlashAttention和CuTe kernel优化训练效率

## How To Use

### 模型使用

```python
# 使用PRTS-4B模型
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("TeleEmbodied/PRTS-4B")
```

### 训练配置

```text
- 硬件：64张H100 GPU
- 训练时间：约2周
- 批次大小：2000
- 学习率：动态调整
```

### 推理配置

```text
- 推理延迟：CRL增加0.45ms（从0.531ms）
- GPU使用：85%利用率
- 支持实时推理
```

## Engineering Notes

### 适用场景

- 需要机器人理解目标可达性的任务
- 复杂的灵巧操作任务
- 需要长程规划的机器人任务

### 配置要点

- 模型大小：4B参数
- 训练数据：需要多样化的机器人操作数据
- 硬件要求：至少8张A100 GPU进行推理

### 与其他工具的关系

- 与GR00T、Octo等LBM模型互补
- 可与MuJoCo、Isaac Sim等仿真环境配合使用
- 支持多种机器人平台

## Common Pitfalls

1. **目标设置不当**：需要合理设置目标可达性阈值
2. **训练数据不足**：需要足够多的多样化训练数据
3. **硬件要求高**：训练和推理都需要高端GPU
4. **泛化能力**：在未见任务上可能表现不佳

## Useful For Me

PRTS对我理解VLA模型的发展方向非常有价值：

- 提供了"目标感"这一新视角来改进VLA模型
- 展示了课程强化学习在机器人任务中的应用
- 提供了可复现的训练和推理代码

## Related Concepts

- [[概念_VLA]]
- [[概念_课程强化学习]]
- [[概念_灵巧操作]]

## Notes

- 发表时间：2026年5月
- 模型大小：4B参数
- 性能：在LIBERO等基准上达到SOTA
- 创新点：首次提出"Goal Reachability Unawareness"问题
- 实时性：CRL仅增加18%推理延迟
