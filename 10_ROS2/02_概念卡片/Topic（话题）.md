---
tags:
  - ros2
  - topic
  - publisher
  - subscriber
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of:
  - "[[10_ROS2/02_概念卡片/ROS 2 系统架构与核心能力]]"
kg_depends_on: []
kg_flow_to: []
kg_compares_with:
  - "[[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系]]"
---

# ROS 2 Topic（话题）

Topic（话题）是 ROS 2 中最常用的通信方式之一，适合持续传递传感器数据、速度指令和机器人状态。

## 通信关系

**Publisher（发布者） → Topic（话题） → Subscriber（订阅者）**

- Publisher 把消息发布到指定 Topic，不需要知道谁在接收。
- Subscriber 订阅指定 Topic，收到消息后进行处理。
- 一个 Topic 可以有多个 Publisher，也可以有多个 Subscriber。

## 通信条件

Publisher 和 Subscriber 要通过同一个 Topic 通信，至少需要：

1. **Topic 名称相同**
2. **消息类型相同**

## 主要特点

- **异步通信**：Publisher 发布消息后通常不等待回复。
- **发布订阅**：通信双方通过 Topic 连接，不直接依赖彼此。
- **适合数据流**：可以持续、间歇或只发布一次消息。
- **一对多或多对多**：同一 Topic 可以连接多个发布者和订阅者。

## 适用场景

- 摄像头持续发布图像。
- 雷达持续发布扫描数据。
- 控制节点发布速度指令。
- 机器人持续发布位置、电量或运行状态。

如果需要“一问一答”，使用 [[10_ROS2/02_概念卡片/Service（服务）|Service]]；如果任务执行时间较长，还需要进度反馈或取消功能，使用 **Action**。参见 [[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系|Topic、Service、Action 的区别与联系]]。

## 最短记忆

**Topic = 异步发布订阅，适合持续传递数据。**

相关概念：[[10_ROS2/02_概念卡片/Node（节点）|Node]]、[[10_ROS2/02_概念卡片/Package（功能包）|Package]]、[[10_ROS2/02_概念卡片/Workspace（工作空间）|Workspace]]
