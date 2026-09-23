# 《Hello 算法》第 4 章 · 数组与链表（Remotion + Code Hike）

白底高饱和的教学动画系统：**左侧代码高亮 ↔ 右侧数据结构动画**，时间轴由统一的「场景节拍（Beat）」驱动。

## 启动

```console
npm i
npm run dev      # 打开 Remotion Studio
```

其他命令：

```console
npm run lint     # tsc + eslint
npx remotion render <composition-id>   # 渲染单个场景，如 array-insert
```

## 已注册的合成（Composition）

在 Studio 左侧可以直接选：

| id | 标题 | 说明 |
|----|------|------|
| `ChapterTOC` | 目录动画 | 砖块隐喻 + 本章目录树 |
| `array-init` / `array-access` / `array-insert` / `array-remove` / `array-traverse` / `array-find` / `array-extend` | 4.1 数组 | 初始化 / 访问 / 插入 / 删除 / 遍历 / 查找 / 扩容 |
| `ll-node` / `ll-init` / `ll-insert` / `ll-remove` / `ll-access` / `ll-find` / `ll-vs-array` / `ll-types` | 4.2 链表 | 节点结构 / 初始化 / 插入 / 删除 / 访问 / 查找 / 对比 / 常见类型 |
| `list-native` / `mylist-model` / `mylist-crud` / `mylist-resize` | 4.3 列表 | 原生操作 / MyList 模型 / 增删改查 / 扩容机制 |
| `Chapter4Full` | **默认合成** | 按注册表顺序串联所有 `enabled` 场景（跳过 stub） |

## 架构（扩展只需加三样东西）

```
src/
├─ registry/
│  ├─ types.ts          # SceneDefinition 类型（场景元数据契约）
│  └─ chapter4.ts       # ★场景注册表：加一条 SceneDefinition 即新增合成
├─ scenes/              # ★动画场景组件（Phase A–E 的产物）
│  ├─ toc/  array/  linked-list/  list/
├─ snippets/            # ★代码片段 + lineOf(代码, "子串") 行号定位
├─ motion/
│  └─ useSceneProgress.ts   # Beat / ScenePhase / useScene 统一时间轴
├─ components/
│  ├─ layout/           # SceneShell / CodePanel / VizPanel / CaptionBar / ProgressDots
│  └─ viz/              # ArrayBlocks / LinkedListNodes / PointerArrow /
│                       # MemoryAddressFormula / CapacityBar / CompareTable
├─ design/tokens.ts     # 色彩 token（白底 + 高饱和橙红，禁 AI 紫）与刻度
├─ Root.tsx             # registry.map 批量注册 Composition + Chapter4Full
└─ Chapter4Full.tsx     # Series 串联 enabled 场景
```

### 新增一个小节的步骤

1. 在 `src/snippets/xxx.ts` 放**官方 TS 代码**片段（字符串常量）；
2. 在 `src/scenes/xxx/Xxx.tsx` 写 `export const xxxBeats: Beat[]` 与 `export const Xxx: React.FC`；
3. 在 `src/registry/chapter4.ts` 加一条 `SceneDefinition`（`Root.tsx` 会自动注册，不需要改根架构）。

### 代码 ↔ 动画同步协议

每个场景由 `Beat[]` 驱动，一个 Beat 同时声明三件事：

```ts
{
  phase: "highlight-code-line",        // idle | highlight-code-line | mutate-viz | emphasize-result | caption
  durationInFrames: 30,
  codeLines: [lineOf(SNIPPET, "nums[i] = nums[i - 1]")],  // 左侧橙色高亮行（按文本定位）
  caption: "nums[i] = nums[i-1]：元素依次右移",            // 底部中文旁白
}
```

规则：**先高亮对应代码行，再播结构动画，最后结果定格 + 一句总结**；
链表 `insert` 的三行指针代码对应三个子动画；动画子组件内用 `useScene()` 取时间轴
（**必须是 `SceneShell` 的子组件**，在渲染外壳的组件里调用会抛错）。

## 视觉规范（强制）

- 背景 `#FFFFFF`，60–70% 留白；色块只用于节点 / 箭头 / 徽章 / 进度
- 第一强调色（当前操作、焦点、目录激活）：橙 `#FF6A00`
- 第二强调色（删除、危险、即将消失）：红 `#FF2D2D`
- 辅助：索引/指针蓝 `#0066FF`、成功绿 `#00C853`、对比紫 `#A100FF`、缓存黄 `#FFD600`
- 徽章：O(1) 绿底、O(n) 橙底、对比蓝底
- 禁止：暗黑整屏、紫色渐变、低饱和莫兰迪、玻璃态大阴影
- UI / 旁白 / 目录标题全部**简体中文**；代码片段保留书中中文注释

## 内容权威来源

- 教材：<https://www.hello-algo.com/chapter_array_and_linkedlist/>
- 官方 TS 代码：<https://github.com/krahets/hello-algo/tree/main/codes/typescript/chapter_array_and_linkedlist>
- 官方 `ListNode`：<https://github.com/krahets/hello-algo/blob/main/codes/typescript/modules/ListNode.ts>

片段放在 `src/snippets/*.ts`，**复杂度与 API 名必须与书一致**，不要自行编造。

## 技术说明

- 代码高亮用 `codehike/code` 的 `highlight(code, "github-light")`，行级高亮通过 block 注解
  `focus` + `AnnotatedLine` 实现（橙色左竖条 + 淡橙底，随 Beat 淡入）；
- 代码字号按面板宽度与行数**自适应缩放**（`measureText`），避免长签名溢出；
- 模板自带的 `Main.tsx`（纯代码漫游）与 `public/code*.tsx` 演示片段已不再注册，保留文件作备用。
