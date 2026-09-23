# 开发任务提示词（交给实现 AI）

> 把本文件全文作为系统/用户提示词交给实现 AI。实现 AI 必须在指定目录内直接改代码并交付可预览的 Remotion 工程。

---

## 0. 角色与总目标

你是资深 Remotion + React + TypeScript 工程师，同时熟悉数据结构教学可视化。

**总目标：** 在已有 Remotion Code Hike 模板工程中，构建《Hello 算法》**第 4 章「数组与链表」** 的教学动画视频系统：

1. **先做目录（TOC）动画**（章节组织关系可视化）
2. **再做每个知识点：左侧/区域 TypeScript 代码 + 右侧/区域数据结构动画**，二者时间轴对齐
3. 架构必须 **可扩展**：后续只需加「场景注册 + 代码片段 + 动画组件」即可新增章节内容，不必重写根架构

**项目根目录（唯一工作区，禁止另起仓库）：**

```
D:\Project\algo\remotion\code-hike
```

**参考教材（权威来源，内容以官方为准）：**

- 网站：https://www.hello-algo.com/chapter_array_and_linkedlist/
- 章节路径：https://www.hello-algo.com/chapter_array_and_linkedlist/array/ 等
- 官方 TS 代码：https://github.com/krahets/hello-algo/tree/main/codes/typescript/chapter_array_and_linkedlist
- 官方 ListNode：https://github.com/krahets/hello-algo/blob/main/codes/typescript/modules/ListNode.ts
- 本地用户已学完本仓库练习：`D:\Project\algo\src\array_list\list.ts`（链表 insert/remove 与书本一致）

**语言：** UI 标签、旁白文字、目录标题全部用**简体中文**。代码注释可保留书中中文风格。

**交付标准：** `npm run dev` 能打开 Remotion Studio；至少注册 `ChapterTOC` 与若干小节 Composition；默认合成可串联预览；白色为主视觉，高饱和强调色正确。

---

## 1. 视觉设计系统（强制）

### 1.1 色彩（全部使用高饱和度，禁止灰扑扑的低饱和“AI 紫”）

| Token | 用途 | 建议值（可微调但必须保持高饱和） |
|-------|------|----------------------------------|
| `--bg` | 主背景 | `#FFFFFF` 纯白 / 极浅暖白 `#FFFCFA` |
| `--surface` | 卡片/节点底板 | `#FFFFFF`，细描边 `#FFE8D6` |
| `--orange` | **第一强调色**（当前操作、焦点节点、目录激活项） | `#FF6A00` 或 `#FF7A00`（高饱和橙） |
| `--red` | **第二强调色**（删除、危险、即将消失的元素、错误路径） | `#FF2D2D` 或 `#E10600`（高饱和红） |
| `--blue` | 辅助：索引、指针箭头、地址 | `#0066FF` |
| `--green` | 辅助：成功、插入完成、新节点落地 | `#00C853` |
| `--purple` | 辅助：对比高亮、次要标签 | `#A100FF` |
| `--yellow` | 辅助：临时值、缓存行提示 | `#FFD600` |
| `--ink` | 主文字 | `#0A0A0A` |
| `--muted` | 次要文字 | `#5C5C5C`（仅文字可略降饱和，色块不行） |

**规则：**

- 画面 **60–70% 白色留白**；色块只用于节点、箭头、徽章、进度。
- 同一时刻主强调色优先 **橙**；删除/破坏性动画切到 **红**；其它操作用蓝/绿辅助。
- 禁止：暗黑主题背景、紫色渐变整屏、低饱和莫兰迪、玻璃态大阴影堆叠。
- 代码区：可用浅色语法主题（如 `github-light` / `light-plus`），与白底统一；不要 `github-dark`。

### 1.2 字体与布局

- 代码：保留现有 Roboto Mono，或补中文用系统/Google 无衬线（如 Noto Sans SC）用于标题与旁白条。
- 分辨率默认 **1920×1080**，`fps=30`。
- 布局推荐（小节场景）：**左 45% 代码 / 右 55% 结构动画**，或上代码下动画；目录页全屏树状导航。
- 底部可保留细进度条；风格轻量，不要厚 Dashboard。

### 1.3 动效气质

- 教学感：慢一点、停顿清楚；关键操作 1.5–3s；过渡 `spring` 或平滑贝塞尔。
- 每个操作结束必须有 **0.4–0.8s 定格**，方便理解。
- 至少 2–3 种意图明确的动效：焦点脉冲（橙）、位移（元素平移）、指针重连（箭头路径变形）。

---

## 2. 现有工程约束（必须在此之上演进，不要推倒重来）

当前模板关键事实：

| 文件 | 作用 |
|------|------|
| `src/Root.tsx` | 目前只有一个 `Composition id="Main"` |
| `src/Main.tsx` | 读取 `public/code*.*`，`Series` 逐步 Code Hike token 过渡 |
| `src/calculate-metadata/*` | `getFiles()` 过滤 `public` 下以 `code` 开头的文件 → 高亮 → 定时长 |
| `public/code1.tsx` … | 示例片段（可替换/迁走） |
| `src/CodeTransition.tsx` | Token 级代码动画 |
| `package.json` | `dev` = `remotion studio` |

**改造原则：**

1. **保留** Code Hike 能力，用于「代码步骤动画」。
2. **扩展** 为多 Composition 架构：`ChapterTOC` + `Array/*` + `LinkedList/*` + `List/*` +（可选）`Summary`。
3. 不要让所有内容继续挤在「只靠 public/codeN 自动串联」这一条路上；改为 **显式场景注册表（Scene Registry）**，每个场景声明：id、标题、时长、代码源、动画组件、旁白文案。
4. `public/` 可按目录存放代码，例如：`public/snippets/array/01-init.ts`；若继续用 `getStaticFiles`，需改造过滤逻辑，或改为场景内 `staticFile` / 直接 `import` / `fetch` 指定路径。
5. 删除或移走无关键的默认 `code1–code4` 演示内容，避免污染章节视频。

---

## 3. 推荐目标目录结构（实现 AI 按此落地）

```
code-hike/
  src/
    Root.tsx                          # 注册全部 Composition + 可选总片
    design/
      tokens.ts                       # 颜色/间距/字体 token
      GlobalStyles.tsx                # 可选
    components/
      layout/
        SceneShell.tsx                # 白底、标题条、左右分栏
        CodePanel.tsx                 # 包装 CodeTransition / Pre
        VizPanel.tsx
        CaptionBar.tsx                # 底部中文讲解一句
        ProgressDots.tsx
      viz/
        ArrayBlocks.tsx               # 连续方块 + 下标
        MemoryAddressFormula.tsx      # base + size * i
        LinkedListNodes.tsx           # 节点 val/next + 箭头
        PointerArrow.tsx
        CapacityBar.tsx               # size vs capacity
        CompareTable.tsx              # 数组 vs 链表
      motion/
        useSceneProgress.ts           # 统一把 frame → 阶段枚举
    scenes/
      toc/
        ChapterToc.tsx                # ★ 第一优先：目录组织关系动画
      array/
        ArrayIntro.tsx
        ArrayInit.tsx
        ArrayAccess.tsx
        ArrayInsert.tsx
        ArrayRemove.tsx
        ArrayTraverse.tsx
        ArrayFind.tsx
        ArrayExtend.tsx
      linked-list/
        LinkedListIntro.tsx
        LinkedListInit.tsx
        LinkedListInsert.tsx
        LinkedListRemove.tsx
        LinkedListAccess.tsx
        LinkedListFind.tsx
        LinkedListTypes.tsx           # 单向/环形/双向（概念）
        ArrayVsLinkedList.tsx
      list/
        ListNativeOps.tsx
        MyListIntro.tsx
        MyListCRUD.tsx
        MyListExtendCapacity.tsx
    registry/
      chapter4.ts                     # 场景元数据注册表（可扩展核心）
      types.ts                        # SceneDefinition 类型
    snippets/                         # 或放 public/snippets
      ... 与书本一致的 TS 代码
    Main.tsx                          # 可保留作「纯代码漫游」备用，或改为编排器
  public/
    snippets/...
```

**扩展约定（写进代码注释）：** 新增动画 = 在 `registry/chapter4.ts` 加一条 `SceneDefinition` + 实现对应 `scenes/**` 组件 + 放 snippet。`Root.tsx` 用 `registry.map` 批量 `<Composition />`。

---

## 4. 内容大纲（必须覆盖；顺序与书一致）

来源：Hello 算法 第 4 章。URL 注意：内存节是 `ram_and_cache`，不是 `memory_and_cache`。

### 4.0 章首页 / 目录页（第一优先级实现）

**Composition id：** `ChapterTOC`

**叙事：**

1. 标题：「第 4 章 · 数组与链表」
2. 书中隐喻动画：整齐砖块（数组） vs 分散砖块 + 藤蔓连接（链表）——用橙连接线
3. **目录树展开动画**（核心）：

```
第 4 章 数组与链表
├── 4.1 数组
│   ├── 初始化 / 访问 / 插入 / 删除 / 遍历 / 查找 / 扩容
│   ├── 优点与局限
│   └── 典型应用
├── 4.2 链表
│   ├── 初始化 / 插入 / 删除 / 访问 / 查找
│   ├── 数组 vs 链表
│   ├── 常见链表类型
│   └── 典型应用
├── 4.3 列表
│   ├── 列表操作
│   └── 列表实现 MyList
├── 4.4 内存与缓存 *（可后期）
├── 4.5 小结（可后期）
└── 4.6 练习（可后期）
```

4. 目录项依次出现；当前章节点用 **橙** 高亮；叶子操作项可轻微错落入场。
5. 结束时提示：「接下来按目录逐节演示增删改查」。

**时长建议：** 12–18 秒（约 360–540 frames @30fps）。

### 4.1 数组 — 必做场景

权威代码：https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/chapter_array_and_linkedlist/array.ts

| Scene id | 标题 | 代码要点 | 动画要点 | 复杂度字幕 |
|----------|------|----------|----------|------------|
| `array-init` | 初始化数组 | `new Array(5).fill(0)` / `[1,3,2,5,4]` | 连续方块生成，下标 0..n-1 | — |
| `array-access` | 访问元素 | `randomAccess` / 下标访问 | 公式 `地址 = 首地址 + 长度×索引`，一跳到位，橙高亮 | O(1) |
| `array-insert` | 插入元素 | `insert(nums, num, index)` | **从尾到 index 整体右移**，尾部元素被挤掉（书中固定长度设定），新值橙闪入 | O(n) |
| `array-remove` | 删除元素 | `remove(nums, index)` | **从 index 起左移**，删格变红淡出 | O(n) |
| `array-traverse` | 遍历数组 | `traverse` 两种 for | 下标指针扫过 / for-of 扫过 | O(n) |
| `array-find` | 查找元素 | `find(nums, target)` | 线性比较，命中橙圈，未命中返回 -1 | O(n) |
| `array-extend` | 扩容数组 | `extend(nums, enlarge)` | 新更长数组出现，元素逐个复制，旧数组淡出 | O(n) |

演示数据建议与书一致：`nums = [1, 3, 2, 5, 4]`。

### 4.2 链表 — 必做场景

权威代码：https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/chapter_array_and_linkedlist/linked_list.ts

| Scene id | 标题 | 代码要点 | 动画要点 | 复杂度 |
|----------|------|----------|----------|--------|
| `ll-node` | 节点结构 | `ListNode { val, next }` | 拆开画 val / next 两格 | — |
| `ll-init` | 初始化链表 | 建 n0..n4，赋值 next：`1→3→2→5→4` | 分散节点 + 箭头连接 | — |
| `ll-insert` | 插入节点 | `insert(n0, P)`：`n1=n0.next; P.next=n1; n0.next=P` | **三步指针重连**（与用户已学一致），P 用橙 | O(1)* |
| `ll-remove` | 删除节点 | `remove(n0)`：删 n0 后继 P | 标注 `n0→P→n1`，`n0.next=n1`，P 变红断开淡出 | O(1)* |
| `ll-access` | 访问节点 | `access(head, index)` | 从头走 index 步，每步蓝箭头 | O(n) |
| `ll-find` | 查找节点 | `find(head, target)` | 逐个比 val，命中橙 | O(n) |
| `ll-vs-array` | 数组 vs 链表 | 对比表 | 并排：访问 O(1) vs O(n)；插入删除 O(n) vs O(1) | 表 |
| `ll-types` | 常见类型 | 概念 | 单向 / 环形 / 双向简图 | — |

\*前提：已持有前驱节点引用。

**删除动画必须讲清：** 参数是前驱 `n0`，删的是 `n0.next`（P），不是删 `n0` 自己。

### 4.3 列表 — 必做场景

| Scene id | 标题 | 要点 |
|----------|------|------|
| `list-native` | 列表常用操作 | `push` / `splice` 插入删除 / 遍历 / 拼接 / 排序（可精简为 CRUD 四步） |
| `mylist-model` | MyList 三要素 | `_capacity`、`_size`、`extendRatio=2`；初始容量 10 |
| `mylist-crud` | get/set/add/insert/remove | size/capacity 双刻度条 |
| `mylist-resize` | extendCapacity | size==capacity 触发；容量×2；元素复制；在 i=5 触发的书中驱动逻辑可演示 |

权威：`my_list.ts`。

### 4.4–4.6（第二期可做，注册表先占位）

- 内存与缓存：存储金字塔、缓存行/局部性（数组连续 vs 链表分散）
- 小结要点回顾
- 练习：读下标 3；在 B 后插 X；容量 3/4 再 append 触发扩容；可选反转链表预告

实现 AI **第一期必须完成：TOC + 4.1 全套 + 4.2 全套（含 vs 表）+ 4.3 MyList 扩容**。其余可 stub。

---

## 5. 「代码 ↔ 动画」同步协议（强制）

每个场景必须实现：

```ts
type ScenePhase =
  | "idle"
  | "highlight-code-line"  // 代码行高亮
  | "mutate-viz"           // 结构变化
  | "emphasize-result"     // 结果定格
  | "caption";             // 中文一句总结
```

规则：

1. **先** 高亮对应代码行（橙下划线或左侧竖条），**再** 播结构动画；或分镜左右同时但以同一 `phase` 驱动。
2. 关键语句与动画步骤一一映射。例：链表 insert 三行代码 → 三个子动画。
3. `CaptionBar` 显示一句中文，例如：「单链表删除看前驱：改 n0.next 跳过 P」。
4. 复杂度用右上角徽章：`O(1)` 绿底 / `O(n)` 橙底。

不要只做「整页代码 token 过渡」而没有结构动画；也不要只有动画没有代码。

---

## 6. 技术实现要求

1. TypeScript 严格模式；组件函数式；Remotion 用 `useCurrentFrame` / `interpolate` / `spring` / `Sequence` / `Series`。
2. `Root.tsx` 注册：
   - `ChapterTOC`
   - 每个 scene 一个 Composition（便于单独渲染）
   - 可选 `Chapter4Full`：按 registry 顺序 `Series` 串联（跳过 stub）
3. `registry/chapter4.ts` 示例形状：

```ts
export type SceneDefinition = {
  id: string;
  title: string;
  section: "toc" | "array" | "linked-list" | "list" | "extra";
  durationInFrames: number;
  component: React.FC;
  snippetPath?: string; // 相对 public 或 src
  captions: string[];   // 分阶段旁白
  enabled: boolean;     // stub 时 false
};
```

4. 代码展示：可继续用 Code Hike（推荐小节场景内 `HighlightedCode`），主题改 `github-light`。
5. 不要引入沉重 UI 库；SVG/HTML/CSS 手写可视化即可。
6. 保持 `npm run dev` 可用；必要时更新 `README.md` 说明如何预览各 Composition。

---

## 7. 实施顺序（严格按此冲刺）

### Phase A — 设计地基
- [ ] `design/tokens.ts`
- [ ] `SceneShell` / `CodePanel` / `VizPanel` / `CaptionBar`
- [ ] `ArrayBlocks` / `LinkedListNodes` / `PointerArrow` 最小可用

### Phase B — 目录
- [ ] `ChapterToc` 完整动画
- [ ] Root 可单独预览

### Phase C — 数组全套
- [ ] init → access → insert → remove → traverse → find → extend

### Phase D — 链表全套
- [ ] node → init → insert → remove → access → find → vs → types

### Phase E — 列表 / MyList
- [ ] native 精简 + MyList model + CRUD + resize

### Phase F — 串联与文档
- [ ] `Chapter4Full`
- [ ] README：如何加新场景（5 步说明）
- [ ] 删除无用默认 demo 片段

---

## 8. 验收清单

- [ ] 白底为主，第一强调橙、第二强调红，其它辅助色高饱和
- [ ] TOC 能看懂第 4 章组织关系
- [ ] 数组插入/删除能看出「整体搬移」
- [ ] 链表插入/删除能看出「改指针」；删除讲清前驱
- [ ] 访问对比：数组一跳 vs 链表逐步走
- [ ] MyList 扩容能看出 size/capacity 与 2× 复制
- [ ] 每个场景有中文一句讲解
- [ ] 新增场景只需改 registry + 新文件
- [ ] `npm run dev` 无报错

---

## 9. 明确不要做的事

- 不要换项目目录；不要改成 pnpm/bun（本模板用 npm 即可）
- 不要暗黑主题整片
- 不要只复制 hello-algo 网站截图
- 不要把所有动画塞进单一 5 分钟无章节结构的视频且无法单独渲染
- 不要删除 Remotion/Code Hike 依赖除非有替代且仍可预览代码高亮动画
- 不要编造与书本冲突的复杂度或 API 名

---

## 10. 给实现 AI 的开场指令（可直接粘贴）

请阅读 `D:\Project\algo\remotion\HELLO_ALGO_CH4_DEV_PROMPT.md` 全文并严格按 Phase A→F 在 `D:\Project\algo\remotion\code-hike` 实现。权威内容以 Hello 算法第 4 章官网与 GitHub TypeScript 代码为准。先交付可预览的 `ChapterTOC` + 数组插入/删除 + 链表插入/删除，再补齐其余必做场景。每完成一个 Phase，用 `npm run dev` 自检。视觉：白底、高饱和橙为主强调、高饱和红为删除强调。架构必须基于 Scene Registry 可扩展。

---

## 附录 A — 书本 TypeScript API 速查

**array.ts：** `randomAccess` | `extend` | `insert` | `remove` | `traverse` | `find`

**linked_list.ts：** `insert(n0, P)` | `remove(n0)` | `access(head, index)` | `find(head, target)`

**ListNode：** `val: number`；`next: ListNode | null`

**MyList：** `size` `capacity` `get` `set` `add` `insert` `remove` `extendCapacity` `toArray`；`extendRatio = 2`；初始 `_capacity = 10`

## 附录 B — 用户已掌握的链表删除心智模型（动画旁白可直接用）

> 单链表删除看前驱。n0 的下一个是待删节点 P。把 n0 的 next 直接指向 P 后面的 n1，链表就跳过了 P。记住：删谁，就改谁前面那个节点的指针。

## 附录 C — 关键图示编号（可对书校对）

- 图 4-1 数组定义与存储  
- 图 4-2 地址公式  
- 图 4-3 中部插入  
- 图 4-4 中部删除  
- 图 4-5 链表节点  
- 图 4-6 链表插入  
- 图 4-7 链表删除  
- 图 4-8 链表类型  
- 表 4-1 数组 vs 链表  

完。
