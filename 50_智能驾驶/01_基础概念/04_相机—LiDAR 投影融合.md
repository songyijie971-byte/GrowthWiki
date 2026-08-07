---
aliases:
  - 视觉与 LiDAR 融合
tags:
  - 智能驾驶
  - autoware
  - lidar
  - camera
  - 多传感器融合
created: 2026-07-31
status: learning
kg_type: concept
kg_domain: intelligent-driving
kg_part_of:
  - "[[50_智能驾驶/智能驾驶]]"
kg_depends_on:
  - "[[50_智能驾驶/01_基础概念/03_LiDAR 输出与相机融合接口]]"
  - "[[10_ROS2/02_概念卡片/Topic（话题）]]"
---

# Autoware 相机—LiDAR 投影融合

> [!warning] 当前验证状态
> 已按 Autoware 官方资料梳理流程，但尚未在本机跑通相机—LiDAR 融合。当前内容属于“文档理解”，不是实验结果。

## 先记住最终答案

> LiDAR 提供目标的 3D 位置和形状，相机提供图像中的 2D 框与类别；投影融合先把 3D 信息投到图像上，再判断它与哪个相机框属于同一目标。

![[50_智能驾驶/99_图片/Autoware视觉-LiDAR融合局部.svg|800]]

这里融合的不是两份原始数据，而是两条感知分支的结果：LiDAR 侧已经形成点簇或 3D 目标，相机侧已经形成 ROI。

## 用一辆车贯穿整条流程

假设道路前方有一辆车：

| 阶段 | 此时知道什么 |
| --- | --- |
| LiDAR 感知 | 前方约 12 米有一个 3D 目标 |
| 相机检测 | 图像中的一个 ROI 类别为 `car` |
| 投影 | LiDAR 目标落到图像中的某个区域 |
| 匹配 | 投影区域与 `car` ROI 高度重合 |
| 融合输出 | 前方约 12 米处有一辆 `car` |

整篇只是在解释：**怎样完成中间的“投影”和“匹配”。**

## 投影融合的六步

### 1. LiDAR 上游提供 3D 结果

LiDAR 点云先经过上游感知，形成 3D 点簇或完整 3D 目标。这里不再展开四种 LiDAR 算法，先把它们统一看成“LiDAR 侧结果”。

### 2. 相机检测器提供 2D ROI

相机检测器在图像中框出目标，并给出类别，例如：

```text
ROI：(x=620, y=300, width=180, height=120)，类别 car
```

这些数值表示图像中的像素区域，不是目标的三维位置。

### 3. 用 TF / 外参转换坐标系

LiDAR 中的点最初位于 LiDAR 坐标系。外参描述 LiDAR 与相机的安装位置和朝向关系，用它可以把点转换到相机坐标系。

```text
LiDAR 坐标中的 3D 点
        ↓ TF / 外参
相机坐标中的 3D 点
```

外参回答的是：**这个 LiDAR 点从相机的位置看，在哪里？**

坐标系还不直观时，回看：

[[50_智能驾驶/01_基础概念/01_LiDAR 点云基础#2. 坐标系与 TF|LiDAR 点云基础：坐标系与 TF]]

### 4. 用 CameraInfo / 内参投影到像素

点进入相机坐标系后，再使用 `CameraInfo` 中的相机内参，把三维位置换算成图像像素位置。

```text
相机坐标中的 3D 点
        ↓ CameraInfo / 内参
图像中的像素 (u, v)
```

内参回答的是：**这个三维点会出现在图像的哪个像素？**

一组 3D 点都投影完成后，就能在图像上形成一个投影区域。

### 5. 用重叠程度匹配 ROI

融合节点比较 LiDAR 投影区域与相机 ROI 的重叠程度。`IoU` 可以直观理解为“两个框重合得有多少”：

- 重合较多：更可能描述同一个目标。
- 重合很少：更可能不是同一个目标。

第一遍不需要计算 IoU，也不用学习严格 / 宽松匹配模式；先看懂“投影区域与 ROI 是否对得上”。

### 6. 更新类别并输出 3D 结果

匹配成功后，融合节点用相机 ROI 的类别更新或补充 LiDAR 侧目标的类别，同时保留 LiDAR 提供的三维位置和形状。

```text
LiDAR：前方约 12 米有一个 3D 目标
相机：这个 ROI 是 car
融合：前方约 12 米有一辆 car
```

![[50_智能驾驶/99_图片/Autoware官网-ROI聚类融合内部流程.svg|800]]

## 为什么空间正确了还需要时间匹配

图像、ROI 与 3D 消息通常不会同时到达。Autoware 会根据时间戳和偏移量收集属于相近时刻的输入，再执行融合。

![[50_智能驾驶/99_图片/Autoware官网-图像投影融合消息收集流程.svg|800]]

车辆和目标都在运动。如果 LiDAR 在一个时刻扫描，而相机稍后才曝光，目标已经移动，即使内外参正确，投影仍可能错位。

![[50_智能驾驶/99_图片/Autoware官网-LiDAR相机时间同步.svg|800]]

因此，投影融合有三个必要前提：

| 前提 | 作用 | 出错时的直观现象 |
| --- | --- | --- |
| TF / 外参正确 | LiDAR 坐标 → 相机坐标 | 投影整体偏向一侧 |
| CameraInfo / 内参正确 | 相机 3D 坐标 → 图像像素 | 像素位置或尺度不对 |
| 时间尽量同步 | 两边描述相近时刻 | 运动目标容易错位 |

## 两个融合节点怎么选择

选择依据不是算法名字，而是 LiDAR 上游输出的消息层级：

| LiDAR 侧结果 | 融合节点 | 投影的内容 |
| --- | --- | --- |
| 尚未形成实例的 `PointCloud2` | `roi_pointcloud_fusion` | 从 2D ROI 中抽取并细化点，形成点簇 |
| 仍保留目标点簇的 `DetectedObjectsWithFeature` | `roi_cluster_fusion` | 目标对应的 3D 点簇 |
| 已形成完整目标的 `DetectedObjects` | `roi_detected_object_fusion` | 3D 目标的形状 |

对应 Apollo、CenterPoint、FRNet 与 LiDAR TransFusion 的接线关系见：

[[50_智能驾驶/01_基础概念/03_LiDAR 输出与相机融合接口|03_LiDAR 输出与相机融合接口]]

> [!important] 不要混淆
> `label_based_euclidean_cluster` 接收带语义字段的点云，把类别相同、位置接近的点聚成目标。它不订阅相机 ROI，不是相机—LiDAR 投影融合节点。

## 在项目代码里怎么认

第一遍只找下面几类入口：

1. 3D 输入：消息是点簇还是完整 `DetectedObjects`。
2. 相机输入：搜索 `rois`、`CameraInfo` 和对应的相机编号。
3. 空间关系：搜索 TF、外参和目标 `frame_id`。
4. 时间关系：搜索时间戳、Collector、timeout 和 timestamp offset。
5. 输出消息：确认融合后仍输出 3D 目标，而不是二维图像。

暂时不要深入网络结构、投影矩阵推导和 IoU 参数；这些留到实际运行或调参时再学。

## 第一遍学完的检查标准

不看笔记，能回答下面四个问题即可：

1. LiDAR 分支和相机分支分别提供什么？
2. 外参和内参分别完成哪一步转换？
3. 为什么空间标定正确仍可能发生错位？
4. `roi_pointcloud_fusion`、`roi_cluster_fusion`、`roi_detected_object_fusion` 分别要求 LiDAR 侧先形成到哪一步？

## 当前设备与验证范围

> [!note]- 已确认设备与待验证事项
> - Orbbec Femto Bolt 是 RGB-D 相机，型号 F00364-152，可以作为相机侧数据源；本机 ROS 2 接入仍待验证。
> - 课题组的 LSLiDAR C16 实物标签为 `C16-1511B`，驱动、网络参数、点云 Topic 和运行状态仍待开机验证。
> - R550 Plus 机器人标签中的 ROS 参数名为 `senior_akm`，系统版本、ROS 接口和传感器安装状态仍待开机确认。
> - 当前只完成文档与接口理解，尚未完成真实设备接入和融合运行。
>
> ![[50_智能驾驶/99_图片/Orbbec-Femto-Bolt-接口裁切.png|650]]
>
> ![[50_智能驾驶/99_图片/LSLiDAR-C16-铭牌-裁切.jpg|550]]
>
> ![[50_智能驾驶/99_图片/R550-Plus-机器人铭牌-裁切.jpg|400]]

## 官方资料

- [Autoware Perception Component Design](https://autowarefoundation.github.io/autoware-documentation/main/design/autoware-architecture-v1/components/perception/)
- [Image Projection Based Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/)
- [ROI Cluster Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/)
- [ROI Detected Object Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-detected-object-fusion/)
- [Label-based Euclidean Cluster](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_euclidean_cluster/docs/label-based-euclidean-cluster/)
