# MuJoCo

## 定义

MuJoCo（Multi-Joint dynamics with Contact）是由Emo Todorov创建、现由DeepMind维护的高性能物理引擎。它是机器人仿真和强化学习领域的主流工具之一。

## 核心特性

- **高性能**：专为机器人仿真优化的物理引擎
- **精确物理**：精确的接触动力学建模
- **GPU加速**：支持MJX（MuJoCo XLA）进行GPU加速
- **跨平台**：支持Linux、Windows、macOS
- **开源**：Apache 2.0许可证

## 技术架构

```
MuJoCo核心引擎
    ↓
MJX (MuJoCo XLA)
    ↓
Google JAX
    ↓
GPU加速
```

## 主要功能

1. **物理模拟**
   - 刚体动力学
   - 接触和碰撞
   - 关节约束
   - 肌腱和执行器

2. **渲染**
   - 离屏渲染
   - 可视化
   - 传感器模拟

3. **机器人支持**
   - 多种机器人模型
   - 自定义机器人
   - 传感器配置

## MJX：GPU加速版本

MJX是MuJoCo的GPU加速版本，基于Google JAX：

- **并行仿真**：支持大规模并行仿真
- **GPU加速**：利用GPU进行计算加速
- **JAX集成**：与JAX生态系统深度集成
- **性能提升**：比CPU版本快14.8倍以上

## 最新进展（2026年）

1. **Warp支持**：支持NVIDIA Warp
2. **MUSA支持**：支持国产GPU（MUSA）
3. **性能优化**：持续的性能优化
4. **社区活跃**：CoRL、ICRA、RSS等顶会广泛使用

## 应用场景

- **强化学习研究**：RL算法开发和测试
- **机器人控制**：控制器设计和验证
- **运动规划**：运动轨迹规划
- **Sim2Real**：仿真到真实的迁移

## 使用示例

```python
# 安装MuJoCo
pip install mujoco

# 安装MJX
pip install mujoco-mjx

# 基本使用
import mujoco
model = mujoco.MjModel.from_xml_path('robot.xml')
data = mujoco.MjData(model)
```

## 与其他工具的关系

- **与Gazebo对比**：性能更好，更适合RL
- **与Isaac Sim对比**：更轻量，学习曲线更平缓
- **与RL框架**：支持Stable Baselines3、SKRL等

## 在知识库中的连接

- 技术文档：[[02_TechDocs/MuJoCo-IsaacSim仿真环境对比]]
- 概念：[[概念_仿真环境]]、[[概念_Isaac_Sim]]

## 参考资料

- MuJoCo官方文档
- MuJoCo和Isaac Sim技术文档，2026年5月
