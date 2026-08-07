---
tags:
  - ros2
  - node
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of:
  - "[[10_ROS2/02_概念卡片/Package（功能包）]]"
  - "[[10_ROS2/02_概念卡片/ROS 2 系统架构与核心能力]]"
kg_depends_on: []
kg_flow_to:
  - "[[10_ROS2/02_概念卡片/Topic（话题）]]"
kg_compares_with: []
---

# ROS 2 节点（Node）

节点就是加入 ROS 2 通信网络、负责一项功能的程序模块。

例如：相机节点发布图像，检测节点读取图像并发布障碍物，控制节点根据结果控制车辆。

节点之间主要通过 Topic、Service 和 Action 通信，区别见 [[10_ROS2/02_概念卡片/Topic、Service、Action 的区别与联系]]。Parameter 用来保存节点的可调配置，例如速度上限、阈值和设备名称。

## 代码和节点的区别

```text
.py 文件   = 节点的代码
Node 对象  = 代码运行后在 ROS 2 中的身份
```

## 一个完整的 Python 节点骨架

```python
import rclpy
from rclpy.node import Node


class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.get_logger().info('节点正在运行')


def main(args=None):
    rclpy.init(args=args)
    node = MyNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

- `MyNode(Node)`：继承 `Node` 已有的日志、通信、参数和定时器等功能。
- `super().__init__('my_node')`：初始化父类，并把运行时节点名设为 `/my_node`。
- `MyNode()`：根据类创建具体的节点对象。
- `self`：表示当前这个节点对象。

```text
rclpy.init(args=args) → 初始化 ROS 2
node = MyNode()       → 创建节点对象
rclpy.spin(node)      → 等待并处理节点的回调
node.destroy_node()   → 销毁节点
rclpy.shutdown()      → 关闭 ROS 2 环境
```

## spin、回调和线程

- 回调函数是“事件发生后再调用的函数”，例如收到消息或定时器到期后执行。
- `rclpy.spin(node)` 会让执行器持续检查并分派该节点已经就绪的回调。
- 默认的单线程执行器会依次处理回调；以后使用多线程执行器或普通 Python 线程时，任务完成顺序不一定和启动顺序相同。
- 多个线程如果会同时修改同一份数据，还需要额外处理同步问题。

## 如何快速判断节点的作用

```text
Node  = 负责工作的程序模块
Topic = Node 之间传递数据的通道
```

不能只根据名称判断，因为 Node 和 Topic 通常都以 `/` 开头。用命令分类查看最可靠：

```bash
ros2 node list    # 列出 Node，例如 /teleop_turtle、/turtlesim
ros2 topic list   # 列出 Topic，例如 /turtle1/cmd_vel、/turtle1/pose
```

### 从图和消息看数据流

```text
rqt_graph 中的椭圆 = Node
带名称的连线       = Topic
箭头方向           = 数据从发布者流向订阅者
```

例如：`/teleop_turtle → /turtle1/cmd_vel → /turtlesim`。

`rqt_graph` 用来查看连接关系；要查看 Topic 中的实际数据，使用：

```bash
ros2 topic echo /turtle1/cmd_vel
```

`Twist` 消息中，`linear.x` 表示前进/后退速度，`angular.z` 表示转向速度。

先运行项目，再打开一个终端：

```bash
ros2 node list
ros2 node info /节点名
```

按下面的顺序判断：

1. 看节点名，猜测它负责什么。
2. 看 `Subscribers`，确定它接收什么数据。
3. 看 `Publishers`，确定它输出什么结果。
4. 根据“输入 → 输出”，判断节点的主要功能。
5. 需要读代码时，再搜索 Topic 名称，找到对应的回调函数。

例如：

> 订阅相机图像，发布障碍物位置  
> → 基本可以判断它是障碍物检测节点。

## 分析节点时回答五个问题

1. 节点名是什么？
2. 输入什么？
3. 输出什么？
4. 它的主要作用是什么？
5. 回调函数在哪里？
