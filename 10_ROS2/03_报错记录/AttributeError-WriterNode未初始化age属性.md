---
date: 2026-07-23
tags:
  - bug
  - python
  - ros2
status: needs-verification
---

# AttributeError - WriterNode 未初始化 age 属性

## 报错

```text
AttributeError: 'WriterNode' object has no attribute 'age'
```

## 记住

定义子类并重写 `__init__()` 时，如果要调用父类的 `__init__()`，需要使用 `super().__init__(...)`。
