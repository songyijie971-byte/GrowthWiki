---
aliases:
  - 四个 LiDAR 包的接口与关系
tags:
  - 智能驾驶
  - autoware
  - lidar
  - 感知
created: 2026-08-03
status: learning
kg_type: concept
kg_domain: intelligent-driving
kg_part_of:
  - "[[50_智能驾驶/智能驾驶]]"
kg_depends_on:
  - "[[50_智能驾驶/01_基础概念/01_LiDAR 点云基础]]"
kg_flow_to:
  - "[[50_智能驾驶/01_基础概念/03_LiDAR 输出与相机融合接口]]"
---

# Autoware LiDAR 感知节点对比

> [!warning] 当前验证状态
> 下列接口已按 Autoware 官方文档核对，但尚未在本机启动节点或查看真实 Topic。组内工程的实际版本、Topic、点字段和参数仍待确认。

## 这篇解决什么问题

只比较老师给出的四个 LiDAR 感知节点：它们各自做什么、输出停在哪一层，以及为什么不能画成一条串行流程。

## 一句话结论

四个节点都接收 LiDAR 点云，但它们是面向不同任务的并行方案，不是必须依次执行的四步。

                                   ┌─ FRNet ─────────────→ 逐点语义点云
    LiDAR → PointCloud2 ───────────┼─ Apollo ────────────→ 带标签的实例点簇
                                   ├─ CenterPoint ───────→ 3D 检测目标
                                   └─ LiDAR TransFusion ─→ 3D 检测目标

## 四个节点放在一张表里

| 节点 | 主要任务 | 官方主输出 | 输出层级 | 当前节点直接使用相机？ |
|---|---|---|---|---|
| Apollo Instance Segmentation | 实例分割 | DetectedObjectsWithFeature | 带标签的实例点簇 | 否 |
| CenterPoint | 3D 目标检测 | DetectedObjects | 完整 3D 目标 | 否 |
| FRNet | 逐点语义分割 | 带类别与概率字段的 PointCloud2 | 逐点语义 | 否 |
| LiDAR TransFusion | 3D 目标检测 | DetectedObjects | 完整 3D 目标 | 否 |

它们的主输入都是 PointCloud2。文档中以 ~ 开头的 Topic 是节点私有相对名称，工程里的完整 Topic 仍由 launch 和 remapping 决定。

## 四个节点分别怎么看

### Apollo：保留目标对应的点簇

![[50_智能驾驶/99_图片/Autoware-Apollo实例分割演示.gif|700]]

Apollo 把点分成不同目标实例，并在 DetectedObjectsWithFeature 中保留点簇特征。后续若要把点簇投影到图像，这些点仍可继续使用。

### CenterPoint：直接输出 3D 目标

![[50_智能驾驶/99_图片/官方-CenterPoint-3D检测示例.png|800]]

输出已经包含目标类别、置信度、位置、朝向和 3D 形状，通常不再要求保留构成目标的原始点簇。

### FRNet：给每个点预测类别

![[50_智能驾驶/99_图片/官方-FRNet-网络结构.png|800]]

简化示例：

```text
点 A：(x=8.2, y=1.1, z=0.7) → car， probability=0.95
点 B：(x=8.3, y=1.2, z=0.8) → car， probability=0.91
点 C：(x=2.0, y=-0.5, z=0.0) → road，probability=0.98
```

FRNet 只说明 A、B 都像“车上的点”，不会直接说明它们属于同一辆车，也不会直接输出车辆的 3D 框。

### LiDAR TransFusion：名称有 Fusion，当前节点仍是 LiDAR-only

![[50_智能驾驶/99_图片/官方-TransFusion-模型流程.png|800]]

原论文图包含 LiDAR 与 Camera 分支，但当前 autoware_lidar_transfusion 文档只声明点云输入和 DetectedObjects 输出。因此不能仅凭模型名称或论文图，就认定当前 ROS 2 节点已经订阅相机。

## 在项目代码里怎么认

1. 看 launch 和 remapping：工程实际启用了哪个节点，输入输出改成了什么 Topic。
2. 看消息类型：输出是 PointCloud2、DetectedObjectsWithFeature 还是 DetectedObjects。
3. 搜 create_subscription、create_publisher、input/pointcloud、output/objects、labeled_clusters。
4. 最后再看模型文件、类别表和阈值参数。

最小运行检查：

    ros2 topic list -t
    ros2 topic info -v <实际输出 Topic>
    ros2 topic echo --once <实际输出 Topic>

只回答两个问题：输出消息类型是什么？结果还保留逐点或点簇信息吗？

## 下一篇

四个节点的输出层级明确后，再根据消息类型选择相机 ROI 融合接口：

[[50_智能驾驶/01_基础概念/03_LiDAR 输出与相机融合接口|03_LiDAR 输出与相机融合接口]]

## 官方资料

- [Apollo Instance Segmentation](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_lidar_apollo_instance_segmentation/)
- [CenterPoint](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_lidar_centerpoint/)
- [FRNet](https://github.com/autowarefoundation/autoware_universe/tree/main/perception/autoware_lidar_frnet)
- [LiDAR TransFusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_lidar_transfusion/)
