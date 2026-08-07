---
tags:
  - ros2
  - service
  - client
  - server
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of:
  - "[[10_ROS2/02_概念卡片/ROS 2 系统架构与核心能力]]"
kg_depends_on:
  - "[[10_ROS2/02_概念卡片/Node（节点）]]"
kg_flow_to: []
kg_compares_with:
  - "[[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系]]"
---

# ROS 2 Service（服务）

Service 是节点之间“一次请求对应一次响应”的通信方式，适合能较快完成的操作；同一个 Service 可以被反复调用。

## 通信关系

**Client 发送 Request → Server 处理 → Client 收到 Response**

Service 不是独立节点，而是节点对外提供的功能：

- 提供某个 Service 的节点是 **Server**。
- 调用这个 Service 的节点是 **Client**。
- 同一个节点可以提供 Service，也可以调用其他节点的 Service。

阅读 Python 代码时，`create_service(...)` 表示节点提供服务，`create_client(...)` 表示节点请求服务。

## 名称与接口

以 turtlesim 为例：

- `/turtlesim`：提供服务的节点。
- `/spawn`：生成乌龟的 Service 名称。
- `turtlesim/srv/Spawn`：规定请求和响应的数据格式。

在 `.srv` 接口中，`---` 上面是请求，下面是响应。

## 最短记忆

**Service = 一问一答，适合快速完成的操作。**

持续或异步传递数据使用 [[10_ROS2/02_概念卡片/Topic（话题）|Topic]]；长任务使用 Action。参见 [[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系|三种通信方式的对比]]。
