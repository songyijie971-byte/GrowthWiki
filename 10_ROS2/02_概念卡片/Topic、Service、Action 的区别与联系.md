---
tags:
  - ros2
  - topic
  - service
  - action
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of:
  - "[[10_ROS2/02_概念卡片/ROS 2 系统架构与核心能力]]"
kg_depends_on:
  - "[[10_ROS2/02_概念卡片/Node（节点）]]"
kg_flow_to: []
kg_compares_with: []
---

# Topic、Service、Action 的区别与联系

三者都是 ROS 2 节点之间的通信方式，但用途不同。

| 方式                                       | 核心特点        | 典型场景        |
| ---------------------------------------- | ----------- | ----------- |
| [[10_ROS2/02_概念卡片/Topic（话题）\|Topic]]     | 异步传递，适合持续数据 | 图像、雷达、机器人状态 |
| [[10_ROS2/02_概念卡片/Service（服务）\|Service]] | 一次请求对应一次响应  | 查询信息、触发操作   |
| Action                                   | 长任务，有反馈，可取消 | 导航、巡检、机械臂任务 |

```text
Topic   = 持续或异步传数据
Service = 一问一答，快速完成
Action  = 长任务，有反馈，可取消
```
