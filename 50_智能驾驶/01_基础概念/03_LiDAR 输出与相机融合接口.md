---
aliases:
  - LiDAR 输出与 ROI 融合接口
tags:
  - 智能驾驶
  - autoware
  - lidar
  - 多传感器融合
created: 2026-08-03
status: learning
kg_type: concept
kg_domain: intelligent-driving
kg_part_of:
  - "[[50_智能驾驶/智能驾驶]]"
kg_depends_on:
  - "[[50_智能驾驶/01_基础概念/02_Autoware LiDAR 感知节点]]"
kg_flow_to:
  - "[[50_智能驾驶/01_基础概念/04_相机—LiDAR 投影融合]]"
---

# LiDAR 感知输出与相机融合接口

> [!abstract] 一句话结论
> **先看 LiDAR 输出的消息类型，再选择相机 ROI 融合节点；不要只看算法名称。**

> [!warning] 当前验证状态
> 下列接线按 Autoware 官方消息接口整理，尚未在组内工程实际连接。版本、Topic 重映射、点字段、TF 和时间戳仍需运行验证。

## 快速选型

| LiDAR 上游 | LiDAR 已形成的结果 | 输出消息 | 接入的 ROI fusion 节点 | 相机侧补上的信息 |
| --- | --- | --- | --- | --- |
| **FRNet** | 逐点语义 | `PointCloud2` | `roi_pointcloud_fusion` | 按 2D ROI 抽取、细化点，形成点簇 |
| **Apollo Instance Segmentation** | 实例点簇 | `DetectedObjectsWithFeature` | `roi_cluster_fusion` | ROI 匹配后更新点簇标签 |
| **CenterPoint / LiDAR TransFusion** | 完整 3D 目标 | `DetectedObjects` | `roi_detected_object_fusion` | ROI 匹配后更新目标类别 |

> [!tip] 一眼区分
> ```text
> PointCloud2                   → roi_pointcloud_fusion      → 生成 / 细化点簇
> DetectedObjectsWithFeature    → roi_cluster_fusion         → 更新点簇标签
> DetectedObjects               → roi_detected_object_fusion → 更新目标类别
> ```
>
> 区别只在于：**LiDAR 侧的对象已经形成到哪一步。**

## 图中是哪一条流程？

> [!example] `roi_cluster_fusion`：已有点簇的情况
> Apollo 这类上游已经输出点簇。融合节点把点簇投影到图像，与相机 ROI 匹配，再用相机检测结果补充或修正标签。
>
> ![[50_智能驾驶/99_图片/Autoware-ROI聚类融合.png|700]]
>
> 图中展示的是 **`DetectedObjectsWithFeature` → `roi_cluster_fusion`**；它不代表由 ROI 新建点簇的 `roi_pointcloud_fusion` 路径。

## 容易混淆的两点

> [!important] FRNet 不是“自动使用语义字段”
> FRNet 的 `PointCloud2` 在接口类型上可接入 `roi_pointcloud_fusion`，但该节点主要使用点与 2D ROI 的投影关系。`class_id`、`probability` 等额外字段是否兼容，仍需在工程中实测。

> [!note] `pointpainting_fusion` 是另一条路线
> 它先给 LiDAR 点附加 2D 类别分数，再送入 3D 检测网络；不属于本页的三个 `roi_*_fusion` 节点。

## 在项目里怎么认

1. **看 LiDAR 输出类型**：`PointCloud2`、`DetectedObjectsWithFeature` 还是 `DetectedObjects`。
2. **看融合输入**：相机 ROI、`CameraInfo`、LiDAR—Camera TF 与时间戳配置是否齐全。
3. **看 launch 重映射**：确认工程中的实际 Topic 接线。

> [!todo] 最小接口检查
> ```bash
> ros2 interface show sensor_msgs/msg/PointCloud2
> ros2 interface show tier4_perception_msgs/msg/DetectedObjectsWithFeature
> ros2 interface show autoware_perception_msgs/msg/DetectedObjects
> ```

## 学习路径

| 上一步 | 下一步 |
| --- | --- |
| [[50_智能驾驶/01_基础概念/02_Autoware LiDAR 感知节点|02_LiDAR 感知节点]] | [[50_智能驾驶/01_基础概念/04_相机—LiDAR 投影融合|04_相机—LiDAR 投影融合]] |

> [!quote]- 官方资料
> - [Image Projection Based Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/)
> - [ROI Cluster Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-cluster-fusion/)
> - [ROI Detected Object Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-detected-object-fusion/)
> - [ROI Pointcloud Fusion](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_image_projection_based_fusion/docs/roi-pointcloud-fusion/)
> - [Apollo Instance Segmentation](https://autowarefoundation.github.io/autoware_universe/main/perception/autoware_lidar_apollo_instance_segmentation/)
