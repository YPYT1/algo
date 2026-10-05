# algo

算法练习仓库（TypeScript + Bun）。

## 环境

- [Bun](https://bun.sh) >= 1.4

```bash
bun install
bun run dev
```

也可直接：

```bash
bun src/main.ts
```

## 脚本

| 命令 | 说明 |
|------|------|
| `bun run dev` | 运行 `src/main.ts` |
| `bun run start` | 同上 |
| `bun run build` | 打包到 `dist/` |
| `bun run typecheck` | 仅做类型检查 |

## 演示动画（Remotion）

《Hello 算法》第 4 章「数组与链表」的教学动画工程位于 [`remotion/code-hike`](./remotion/code-hike)（独立的 npm 工程，使用自己的依赖）：

```bash
cd remotion/code-hike
npm i        # 首次安装依赖
npm run dev  # 启动 Remotion Studio，浏览器打开预览
```

在 Studio 左侧下拉框可选择要预览的合成：

- `ChapterTOC` — 章节目录动画
- `array-*` / `ll-*` / `mylist-*` — 数组 / 链表 / 列表各小节场景
- `Chapter4Full` — 默认合成，按注册表顺序串联全章

渲染单个场景为视频：

```bash
cd remotion/code-hike
npx remotion render <composition-id>   # 如 npx remotion render array-insert
```

架构、视觉规范与新增场景步骤详见 [`remotion/code-hike/README.md`](./remotion/code-hike/README.md)。
