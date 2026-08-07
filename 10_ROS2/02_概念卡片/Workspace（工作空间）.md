---
tags:
  - ros2
  - workspace
  - concept
kg_type: concept
kg_domain: ros2
kg_part_of: []
kg_depends_on: []
kg_flow_to: []
kg_compares_with: []
---

# ROS 2 工作空间（Workspace）

工作空间是存放和构建多个 ROS 2 功能包的目录。

```text
Workspace = 装多个 Package 的总项目目录
Package   = Workspace 中的具体功能项目
```

```text
ros2_ws/
├── src/       自己维护的功能包源码
├── build/     构建过程文件，由colcon生成
├── install/   构建结果，由colcon生成
└── log/       构建日志，由colcon生成
```

源码放在 `src` 中；不要手动把源码放进 `build`、`install` 或 `log`。

工作空间本身就是普通目录：先创建 `src`，再由 `colcon build` 自动生成 `build`、`install` 和 `log`。

## 创建工作空间

```bash
mkdir -p ~/chapter2_ws/src
```

`mkdir -p` 会在目录不存在时创建它；目录已经存在时不会重复创建或报错。

功能包需要创建或移动到 `~/chapter2_ws/src` 中，项目单位见 [[10_ROS2/02_概念卡片/Package（功能包）|Package（功能包）]]。

## 从构建到运行

```bash
source /opt/ros/humble/setup.bash
cd ~/chapter2_ws
colcon build --packages-select demo_python_pkg
source install/setup.bash
ros2 run demo_python_pkg python_node
```

不加 `--packages-select` 时，`colcon build` 会构建工作空间中的全部功能包。

`package.xml` 中声明的依赖会影响功能包的构建顺序，但不会自动安装系统中缺失的依赖。`source` 只对当前终端生效；打开新终端后需要重新执行 underlay 和工作空间 overlay 的 `source`。
