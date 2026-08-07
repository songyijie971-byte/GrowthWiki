---
tags:
  - ros2
  - architecture
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of: []
kg_depends_on: []
kg_flow_to: []
kg_compares_with: []
---

# ROS 2 系统架构与核心能力
ROS 2 把机器人功能拆成多个节点，让感知、决策、执行等模块通过统一接口协同工作。

## 系统结构

```text
节点应用
  ↓
rclpy / rclcpp
  ↓
RMW
  ↓
DDS
  ↓
操作系统
```

- **rclpy / rclcpp**：Python / C++ 编程接口。
- **RMW**：连接上层代码与不同 DDS 实现。
- **DDS**：负责底层分布式通信。

## 核心能力

- **通信**：Topic、Service、Action。
- **配置**：Parameter。
- **调试与数据**：rqt、RViz、ros2 bag。
- **机器人功能**：TF、URDF、Gazebo、Nav2。

相关笔记：[[10_ROS2/02_概念卡片/Node（节点）|Node（节点）]]、[[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系]]、[[10_ROS2/01_常用指令|常用指令]]
