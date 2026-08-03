# Palantir 架构术语存档

## 这份笔记是干什么的

先把 Palantir 里最容易混淆的 4 个概念单独存档：

- Foundry
- Ontology
- AIP
- Apollo

后面继续研究时，可以直接接着这份笔记往下拆，不用重新解释一轮。

## 一句话总览

- **Foundry**：企业数据、流程、应用开发的底座
- **Ontology**：把数据映射成业务对象、关系、动作、权限的业务对象层
- **AIP**：把大模型和 Agent 接到 Ontology 与业务流程上的 AI 层
- **Apollo**：负责部署、升级、运维 Foundry / AIP 的发布与运维平台

## 1. Foundry 是什么

Foundry 是 Palantir 的企业数据与运营平台。

它主要负责：

- 接企业内部和外部数据源
- 做数据整合、转换、建模
- 开发分析应用和业务应用
- 把结果接回真实运营流程

最重要的一点是：

**Foundry 不是单纯的数据仓库，而是面向运营闭环的数据与应用底座。**

## 2. Ontology 是什么

Ontology 是 Palantir 很核心的一层。

它不是普通“语义层”，而是把数据资产映射成现实业务世界中的：

- 对象
- 关系
- 动作
- 权限

常见元素包括：

- `Object types`：客户、工单、设备、库存、交易等
- `Link types`：对象之间的关系
- `Action types`：审批、更新状态、发起任务等动作
- `Functions / logic`：业务逻辑和计算规则
- `Security`：谁能看、谁能做、谁能批准

所以 Ontology 的关键价值是：

**它把“数据世界”变成“业务世界”，并且这个业务世界是可操作的。**

## 3. AIP 是什么

AIP 是 Palantir 的 AI 平台。

它负责：

- 接入 LLM 和多模态模型
- 构建 LLM-driven functions
- 创建和管理 agents
- 做 automations
- 做 evals
- 在企业权限和治理框架下安全运行

它和普通企业聊天机器人的区别在于：

**AIP 不是悬空的 AI 层，而是建立在 Foundry + Ontology 之上。**

也就是说，AIP 里的 Agent 不只是“会回答”，而是可以：

- 读业务对象
- 理解对象关系
- 触发业务动作
- 在权限框架下执行流程

## 4. Apollo 是什么

Apollo 是 Palantir 的持续交付和运维平台。

它负责：

- 多环境部署
- 持续升级
- 零停机发布
- 监控与运维
- 管理 Palantir 产品在云、私有化、高监管环境里的实例

它不是业务用户直接感知最强的一层，但对 Palantir 这种复杂部署场景非常关键。

## 四者关系

最顺的理解顺序是：

1. **Foundry** 把企业数据和流程底座搭起来
2. **Ontology** 把底座映射成业务对象、关系、动作、权限
3. **AIP** 让 AI / Agent 在这套对象世界里思考、决策、执行
4. **Apollo** 负责把前面这一整套安全地部署和运转起来

可以粗暴理解成：

```text
Apollo
  └─ 部署、升级、运维

AIP
  └─ AI / Agent / Automation / Evals

Ontology
  └─ 对象 / 关系 / 动作 / 权限 / 业务逻辑

Foundry
  └─ 数据 / 管道 / 应用 / 工作流 / 运营底座
```

## 最容易混淆的点

### Foundry 和 Ontology 不是一回事

- Foundry 更大，是平台底座
- Ontology 是 Foundry 里最关键的一层业务抽象

### AIP 和 Foundry 不是替代关系

- Foundry 不是“旧平台”
- AIP 也不是“新平台取代旧平台”
- 更准确地说：**AIP 把 AI 接入 Foundry + Ontology，形成决策执行闭环**

### Apollo 不是面向业务用户的产品

- 它更像平台工程和运维控制层
- 这层对复杂企业环境和高监管部署非常关键

## 对公司价值决策系统的启发

如果拿“公司价值决策系统”来类比，可以先粗略这么看：

- **Foundry**：财务、产业链、产品、价格、政策、产能、客户等研究数据底座
- **Ontology**：把 `公司 / 产线 / 产品 / 客户 / 资本开支 / 技术节点 / 事件 / 约束` 对象化，并定义关系与状态
- **AIP**：在对象层上挂分析 agent，让它能更新对象、识别变化、生成判断
- **Apollo**：让研究数据更新、模型重跑、报告产出、估值更新这套流程稳定运转

## 后续可继续展开的方向

后面如果继续研究，优先顺序建议是：

1. Foundry 和 Ontology 的边界到底怎么划
2. AIP 里的 Agent 与业务动作怎么绑定
3. Palantir 的治理和审批链条怎么设计
4. 哪些机制适合迁移到公司价值决策系统

## 参考来源

- Palantir Foundry: https://www.palantir.com/platforms/foundry/
- Palantir AIP: https://www.palantir.com/platforms/aip/
- Palantir Apollo docs: https://palantir.com/docs/apollo/core/introduction/
- Palantir Ontology overview: https://palantir.com/docs/foundry/ontology/overview/
- Palantir architecture center: https://palantir.com/docs/foundry/architecture-center/platforms/
