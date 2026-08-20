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

![[50_智能驾驶/99_图片/Autoware视觉-LiDAR融合局部.svg|800]]

> LiDAR 那边不是直接送你一坨点云，而是先经过上游感知（CenterPoint、Apollo 那类），已经认出了「这是目标、位置在 3D 空间哪里」；相机那边也不是直接给你一张图，而是先检测出 2D 框 + 类别。
>
> **融合 = 把这两个「已识别结果」对齐。**
>
> 为什么强调这点？因为它们是不同维度的信息：LiDAR 知道「在空间哪个点」但不知道「这是什么」，相机知道「这是什么（car）」但不知道「距离多远」。合起来才完整。这就是多传感器融合的价值——互补。

## 用一辆车贯穿整条流程

假设道路前方有一辆车：

| 阶段 | 此时知道什么 |
| --- | --- |
| LiDAR 感知 3D | 前方约 12 米有一个 3D 目标 |
| 相机检测 2D | 图像中的一个 ROI 类别为 `car` |
| 投影 3D→2D | LiDAR 目标落到图像中的某个区域 |
| 匹配 对应关系 | 投影区域与 `car` ROI 高度重合 |
| 融合输出 3D位置+类别 | 前方约 12 米处有一辆 `car` |

上面的表格是「按阶段横着看」，下面这张图是「按流程竖着走」——把同一辆车从头到尾的对齐过程连成一条线：

```text
LiDAR 点云 ──感知──→ 「前方12米有3D目标」      (知道位置，不知道是啥)
                                                │
相机图像 ──检测──→ 「ROI=car」                (知道是啥，不知道多远)
                                                │
                外参转换 LiDAR坐标→相机坐标     ← 第一步对齐：空间
                内参投影 相机坐标→像素(u,v)    ← 第二步对齐：投影到画面
                                                │
              投影区域 与 car ROI 对比重合度    ← 第三步对齐：匹配置信
                                                │
    匹配成功 → 用相机类别补全 LiDAR 目标        ← 合成
    输出：前方12米有一辆 car 🎉
```

图里出现的「三步对齐」正好对应后文讲的前提：

- 第一步对齐（空间）→ 外参
- 第二步对齐（投影）→ 内参
- 第三步对齐（匹配）→ 重叠程度（第一遍先不展开 IoU 计算）

## 投影融合的六步

### 1. LiDAR 上游提供 3D 结果

LiDAR 点云先经过上游感知，形成 3D 点簇或完整 3D 目标。

### 2. 相机检测器提供 2D ROI

相机检测器在图像中框出目标，并给出类别，例如：

```text
ROI：(x=620, y=300, width=180, height=120)，类别 car
```

### 3. 用 TF / 外参转换坐标系

![[Pasted image 20260819155910.png|700]]

**外参换眼睛，内参按快门**

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

### 5. 用重叠程度匹配 ROI（Region of Interest）

融合节点比较 LiDAR 投影区域与相机 ROI 的重叠程度。

**IoU**（IoU = 两个框的交集面积 / 两个框的并集面积）可以直观理解为“两个框重合得有多少”：取值范围 0~1：

- 1 = 完全重合
- 0 = 完全不相交
- 一般取阈值（比如 0.5）来判断“算不算同一个目标”

> **ROI** 是“框”本身（相机的输出，一个矩形区域）
>
> **IoU** 是衡量“两个框重叠多少”的指标（一个数字，0~1）

### 6. 更新类别并输出 3D 结果

匹配成功后，融合节点用相机 ROI 的类别更新或补充 LiDAR 侧目标的类别，同时保留 LiDAR 提供的三维位置和形状。

```text
LiDAR：前方约 12 米有一个 3D 目标
相机：这个 ROI 是 car
融合：前方约 12 米有一辆 car
```

## 为什么空间正确了还需要时间匹配

这是很多人第一次最容易忽略的一点：空间对齐不等于时间对齐。内外参都对了，但 LiDAR 扫描是某个瞬间，相机曝光是另一个瞬间，车就在这中间的几十毫秒里往前开了几厘米——激光点投到图像上会落到"车刚才在的位置"，于是和现在拍到的车对不上。所以 Autoware 用一个叫 Collector / 时间戳 offset 的机制，把相近时刻的消息攒一起再融合。

## 当前设备与验证范围

## 官方资料

- [Autoware Perception Component Design](https://autowarefoundation.github.io/autoware-documentation/main/design/autoware-architecture-v1/components/perception/)
- [Image Projection Based Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/)
- [ROI Cluster Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/)
- [ROI Detected Object Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-detected-object-fusion/)
- [Label-based Euclidean Cluster](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_euclidean_cluster/docs/label-based-euclidean-cluster/)
