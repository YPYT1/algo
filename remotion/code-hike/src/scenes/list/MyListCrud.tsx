import React from "react";
import { ArrayBlocks, ArrayCell } from "../../components/viz/ArrayBlocks";
import { CapacityBar } from "../../components/viz/CapacityBar";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { SceneShell } from "../../components/layout/SceneShell";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { Tone, colors } from "../../design/tokens";
import { MYLIST_CRUD } from "../../snippets/list";
import { lineOf } from "../../snippets/lineOf";

/** 底层数组格子（92 × 10 = 920，正好放进右侧动画区） */
const CRUD_CELL = 92;
/** 可见容量 10 格：前 5 格有值，后 5 格空槽 */
const SLOTS = 10;
/** 插入 / 删除相位参与搬移的元素个数 */
const SHIFT_COUNT = 2;

type CrudItem = {
  key: string;
  value: number;
  /** 静态槽位（ArrayBlocks 的 key 前缀）：始终等于初始位置 */
  slot: number;
  /** 插入相位位移（0 或 +1） */
  ins: number;
  /** 删除相位位移（0 或 -1） */
  rem: number;
  insOrder: number;
  remOrder: number;
  role: "base" | "inserted";
};

/** insert(3, num)：索引 3 及之后的元素右移一格 */
const insDelta = (slot: number): number => (slot >= 3 ? 1 : 0);
/** remove(3)：插入后位于索引 4 及之后的元素左移一格 */
const remDelta = (slot: number): number => (slot + insDelta(slot) >= 4 ? -1 : 0);

const RAW: { value: number; slot: number }[] = [
  { value: 1, slot: 0 },
  { value: 3, slot: 1 },
  { value: 2, slot: 2 },
  { value: 5, slot: 3 },
  { value: 4, slot: 4 },
];

const ITEMS: CrudItem[] = RAW.map((it) => {
  const ins = insDelta(it.slot);
  const rem = remDelta(it.slot);
  const current = it.slot + ins + rem;
  return {
    key: `${it.slot}:${it.value}`,
    value: it.value,
    slot: it.slot,
    role: "base" as const,
    ins,
    rem,
    // 插入：从尾部往回搬；删除：从前往后搬
    insOrder: ins === 1 ? 4 - it.slot : 0,
    remOrder: rem === -1 ? current - 4 : 0,
  };
});

export const myListCrudBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "MyList 增删改查：底下就是一条数组 + size / capacity 双刻度",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(MYLIST_CRUD, "return this.arr[index]")],
    caption: "① get(index)：直接读底层数组 arr[index]",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 44,
    caption: "蓝色指针一跳到位 —— get 是 O(1)，一个元素都不用搬",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 30,
    caption: "get(1) 返回 3：一次寻址 → O(1)",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(MYLIST_CRUD, "public insert(index")],
    caption: "② insert(index, num)：在索引 3 插入 6，后面的元素要让位",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(MYLIST_CRUD, "_size === this._capacity")],
    caption: "先检查：若 size == capacity，会先调用 extendCapacity 扩容",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 60,
    codeLines: [lineOf(MYLIST_CRUD, "this.arr[j + 1] = this.arr[j]")],
    caption: "索引 3 之后的元素整体右移一格，6 插入空位，size 5 → 6",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 34,
    codeLines: [lineOf(MYLIST_CRUD, "this._size++")],
    caption: "insert 要搬移元素 → O(n)；_size++ 后 size = 6，容量仍是 10",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(MYLIST_CRUD, "public remove(index")],
    caption: "③ remove(index)：删除索引 3 的元素",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 56,
    codeLines: [lineOf(MYLIST_CRUD, "this.arr[j] = this.arr[j + 1]")],
    caption: "该格变红淡出，后面的元素左移补位，size 6 → 5",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 36,
    codeLines: [lineOf(MYLIST_CRUD, "this._size--")],
    caption: "remove 同样要搬移 → O(n)；_size-- 后回到 5",
  },
  {
    phase: "caption",
    durationInFrames: 40,
    caption: "底层就是数组：增删要搬移 → O(n)，访问 O(1)",
  },
];

const CrudViz: React.FC = () => {
  const t = useScene();
  const b = t.beatIndex;
  const insP = t.progressOf(6);
  const remP = t.progressOf(9);

  /** 相位内交错搬移：order 越小越先动 */
  const stagger = (p: number, order: number, count: number): number => {
    const duration = 0.5;
    const start = count <= 1 ? 0 : (order * (1 - duration)) / (count - 1);
    return between(p, start, start + duration);
  };

  const insEnter = between(t.frame, t.startOf(6) + 34, t.startOf(6) + 54);
  const remFade = between(remP, 0.06, 0.45);

  /** 容量条上的 size：随新元素落位 +1，随被删元素消失 -1 */
  const insertedDone = b >= 7 || (b === 6 && insEnter >= 0.7);
  const removedDone = b >= 10 || (b === 9 && remFade >= 0.6);
  const size = 5 + (insertedDone ? 1 : 0) - (removedDone ? 1 : 0);

  // 蓝色指针（get 的 index = 1）与橙色指针（insert / remove 的 index = 3）
  const ptrGet =
    between(t.frame, t.startOf(1) + 4, t.startOf(1) + 16) -
    between(t.frame, t.startOf(4), t.startOf(4) + 10);
  const ptrTarget =
    between(t.frame, t.startOf(4) + 4, t.startOf(4) + 16) -
    between(t.frame, t.startOf(11), t.startOf(11) + 10);

  const cells: ArrayCell[] = [];

  ITEMS.forEach((it) => {
    const enter = between(
      t.frame,
      t.startOf(0) + it.slot * 3,
      t.startOf(0) + it.slot * 3 + 16,
    );
    const dx =
      it.ins * stagger(insP, it.insOrder, SHIFT_COUNT) +
      it.rem * stagger(remP, it.remOrder, SHIFT_COUNT);

    let tone: Tone = "default";
    if (it.slot === 1 && b >= 1 && b <= 3) tone = "focus"; // get 命中的值变橙
    else if ((b === 6 || b === 7) && it.ins === 1) tone = "focus"; // 插入右移（橙）
    else if ((b === 9 || b === 10) && it.rem === -1) tone = "focus"; // 删除左移（橙）

    cells.push({
      key: it.key,
      value: it.value,
      dx,
      dy: (1 - enter) * 40,
      opacity: enter,
      tone,
    });
  });

  // insert(3, 6) 插入的 6：绿色落位 → remove(3) 时变红淡出
  const insOpacity = insEnter * (1 - remFade);
  cells.push({
    key: "3:6",
    value: remFade >= 1 ? null : 6,
    dy: (1 - insEnter) * -38,
    opacity: insOpacity,
    tone: b <= 7 ? "fresh" : "danger",
    scale: b <= 7 ? 0.72 + 0.28 * insEnter : 1 - remFade * 0.12,
    note:
      insOpacity < 0.06
        ? undefined
        : b <= 7
          ? insEnter > 0.55
            ? "插入"
            : undefined
          : remFade > 0.06
            ? "删除"
            : undefined,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div style={{ position: "relative", width: SLOTS * CRUD_CELL, height: 272 }}>
        <ArrayBlocks cells={cells} slots={SLOTS} cellSize={CRUD_CELL} />
        <PointerArrow
          x={1 * CRUD_CELL + CRUD_CELL / 2}
          y={CRUD_CELL + 74}
          color={colors.blue}
          label="index = 1"
          opacity={Math.max(0, ptrGet)}
          direction="up"
        />
        <PointerArrow
          x={3 * CRUD_CELL + CRUD_CELL / 2}
          y={CRUD_CELL + 74}
          color={colors.orange}
          label="index = 3"
          opacity={Math.max(0, ptrTarget)}
          direction="up"
        />
      </div>
      <CapacityBar size={size} capacity={10} max={10} />
    </div>
  );
};

export const MyListCrud: React.FC = () => (
  <SceneShell
    beats={myListCrudBeats}
    title="列表增删改查"
    section="4.3 列表"
    badge={{ label: "O(n)", tone: "orange" }}
    code={MYLIST_CRUD}
    codeTitle="my_list.ts"
  >
    <CrudViz />
  </SceneShell>
);
