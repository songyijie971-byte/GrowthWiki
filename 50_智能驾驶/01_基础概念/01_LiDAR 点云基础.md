---
aliases:
  - 点云、聚类与点云拼接
tags:
  - 智能驾驶
  - lidar
  - 点云
created: 2026-07-30
status: learning
kg_type: concept
kg_domain: intelligent-driving
kg_part_of:
  - "[[50_智能驾驶/智能驾驶]]"
kg_flow_to:
  - "[[50_智能驾驶/01_基础概念/02_Autoware LiDAR 感知节点]]"
---

# LiDAR 点云基础：坐标、聚类与拼接

> [!warning] 当前验证状态
> 已完成概念和官方资料整理，尚未在本机运行点云 Demo 或 Autoware。

## 这篇解决什么问题

先建立后面三篇都会用到的基础：LiDAR 怎样形成点云、为什么点云带坐标系、聚类和拼接分别改变什么。

    LiDAR 扫描
      ↓
    一帧 PointCloud2
      ├─ 聚类：在一份点云中把邻近点分组
      └─ 拼接：把多份点云变换到同一坐标系后合并

![[50_智能驾驶/99_图片/一句话理解-点云聚类拼接总览.svg]]

## 1. 点云：LiDAR 的空间采样

LiDAR 根据激光的反射结果计算距离和方向，一次扫描会得到大量空间点。每个点通常至少包含 x、y、z 坐标，还可能带有反射强度等字段；这些点合在一起就是一帧点云。

![[50_智能驾驶/99_图片/LiDAR与点云.svg]]

原始点只说明“这个位置有反射”，本身不等于汽车、行人或锥桶。类别、目标实例和 3D 框都需要后续算法继续推断。

## 2. 坐标系与 TF

点的 x、y、z 只有结合坐标系才有意义。PointCloud2 的 frame_id 表示这帧点云当前属于哪个坐标系；TF 则说明两个坐标系之间怎样旋转和平移。

![[50_智能驾驶/99_图片/XYZ坐标系与TF.svg]]

多雷达或相机—LiDAR 系统不能直接拿两组坐标比较，必须先完成坐标变换。否则同一个物体会出现在不同位置，拼接会产生重影，投影也会错位。

## 3. 聚类：把邻近点分成目标候选

聚类根据点之间的距离，把一份点云分成若干点簇。它不移动点，也不等于识别类别，只是在回答“哪些点可能属于同一个物体”。

![[50_智能驾驶/99_图片/点云聚类.svg]]

聚类后可以再根据每个点簇的高度、宽度、形状或上游标签，估计目标类别并拟合 3D 框。

![[50_智能驾驶/99_图片/PCL官网-欧式聚类结果.jpg]]

> 图中不同颜色表示 PCL 官方教程提取出的不同点簇，不是本地实验结果。

## 4. 拼接：把多份点云合到一起

多雷达点云最初分别使用各自的传感器坐标系。拼接通常包含三个动作：

1. 根据 TF / 外参把各路点云变换到统一坐标系。
2. 根据时间戳匹配或补偿不同传感器的采样时刻。
3. 合并变换后的点，发布一份统一点云。

![[50_智能驾驶/99_图片/Autoware官网-点云拼接流程.svg]]

Autoware 的 concatenate_and_time_synchronize_node 用于收集、同步并拼接多路点云。它可以扩大覆盖范围、减少盲区，但标定或同步不准时也会造成重影。

| 左侧 LiDAR | 顶部 LiDAR | 右侧 LiDAR |
| --- | --- | --- |
| ![[50_智能驾驶/99_图片/Autoware官网-左侧LiDAR点云.png\|220]] | ![[50_智能驾驶/99_图片/Autoware官网-顶部LiDAR点云.png\|220]] | ![[50_智能驾驶/99_图片/Autoware官网-右侧LiDAR点云.png\|220]] |

拼接后的官方示例：

![[50_智能驾驶/99_图片/Autoware官网-多LiDAR点云拼接结果.png]]

## 在项目代码里怎么认

- 搜 PointCloud2、frame_id 和 input/pointcloud：确认点云 Topic 与坐标系。
- 搜 tf2、lookupTransform：确认代码是否做坐标变换。
- 搜 concatenate_and_time_synchronize_node：确认是否在做多路点云同步与拼接。
- 看到 cluster、tolerance、min_points：通常是在做点云聚类或过滤。

## 下一篇

有了点云基础后，再看四个并行方案怎样把点云变成逐点语义、实例点簇或完整 3D 目标：

[[50_智能驾驶/01_基础概念/02_Autoware LiDAR 感知节点|02_Autoware LiDAR 感知节点]]

## 官方资料

- [Autoware Euclidean Cluster](https://github.com/autowarefoundation/autoware_universe/tree/main/perception/autoware_euclidean_cluster)
- [PCL Euclidean Cluster Extraction](https://pointclouds.org/documentation/tutorials/cluster_extraction.html)
- [Autoware Pointcloud Concatenation](https://autowarefoundation.github.io/autoware_universe/main/sensing/autoware_pointcloud_preprocessor/docs/concatenate-data/)

