---
tags:
  - ros2
  - package
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of:
  - "[[10_ROS2/02_概念卡片/Workspace（工作空间）]]"
kg_depends_on: []
kg_flow_to: []
kg_compares_with: []
---

# ROS 2 功能包（Package）

功能包是按照 ROS 2 规则组织代码、依赖和运行入口的项目文件夹。

## 快速理解

```text
Package  = 装代码和资源的项目盒子
代码模块 = 盒子里的具体代码
可执行入口 = 能从盒子外直接启动程序的门
```

一个 Package 不只包含可执行程序，还可以包含源代码模块、配置文件、Launch 文件、消息接口、测试和依赖信息。它可以有零个、一个或多个可执行入口。

查看已安装功能包中的可执行入口：

```bash
ros2 pkg executables turtlesim
```

例如 `turtlesim` 功能包提供 `turtlesim_node`、`turtle_teleop_key`、`draw_square` 和 `mimic`。运行格式是：

```bash
ros2 run 功能包名 可执行入口名
```

## 创建 Python 功能包

在工作空间的 `src` 目录中执行：

```bash
ros2 pkg create demo_python_pkg --build-type ament_python --license Apache-2.0
```

## Python 功能包结构

```text
demo_python_pkg/
├── demo_python_pkg/
│   ├── __init__.py          Python包标识文件
│   ├── python_node.py       发布节点代码
│   └── book_subscriber.py   订阅节点代码
├── resource/
│   └── demo_python_pkg      ament资源索引标记
├── test/                    测试文件
├── package.xml              功能包信息和依赖
├── setup.cfg                可执行文件安装位置
├── setup.py                 安装方式和运行入口
└── LICENSE                  开源许可证
```

## 为什么要在 setup.py 注册入口

`python_node.py` 保存实际代码；`setup.py` 负责登记代码的安装方式和运行入口。`ros2 run` 不会扫描所有 `.py` 文件，只查找已经注册并安装的入口。

```python
entry_points={
    'console_scripts': [
        'python_node = demo_python_pkg.python_node:main',
        'book_subscriber = demo_python_pkg.book_subscriber:main',
    ],
}
```

例如这一行：

```python
'python_node = demo_python_pkg.python_node:main'
```

表示：

```text
运行 python_node
→ 找到 demo_python_pkg/python_node.py
→ 执行其中的 main()
```

其中 `demo_python_pkg.python_node` 是 Python 模块写法：用 `.` 表示目录层级，并省略 `.py`。

在 `package.xml` 中声明节点运行所需的依赖：

```xml
<depend>rclpy</depend>
<depend>std_msgs</depend>
```

`setup.cfg` 把脚本安装到当前功能包的 `lib` 目录，使 ROS 2 能通过 `ros2 run` 找到入口：

```ini
[develop]
script_dir=$base/lib/demo_python_pkg

[install]
install_scripts=$base/lib/demo_python_pkg
```

## 新增 Python 程序后的顺序

```text
新建 .py 文件
→ 在 setup.py 注册 console_scripts
→ 回到工作空间执行 colcon build
→ source install/setup.bash
→ ros2 run 功能包名 程序入口名
```

只创建 `.py` 文件而不注册入口，`ros2 run` 找不到这个程序；修改入口后不重新编译，终端仍会使用旧的安装结果。

## 容易混淆的名字

```text
demo_python_pkg   = 功能包名
python_node       = 发布程序入口名
/python_node      = 发布程序运行后的节点名
book_subscriber   = 订阅程序入口名
/book_subscriber  = 订阅程序运行后的节点名
/book             = 两个节点之间传递消息的 Topic
```

> 程序入口是“从哪扇门启动”，节点名是“启动后在 ROS 2 网络中叫什么”。

运行时使用功能包名和程序入口名：

```bash
ros2 run demo_python_pkg python_node
```

节点的含义见 [[10_ROS2/02_概念卡片/Node（节点）|Node（节点）]]，完整构建过程见 [[10_ROS2/02_概念卡片/Workspace（工作空间）|Workspace（工作空间）]]，本次发布订阅项目见 [[10_ROS2/02_概念卡片/Topic（话题）|Topic（话题）]]。
