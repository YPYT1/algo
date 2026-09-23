import React from "react";
import { ArrayBlocks, ArrayCell, CELL } from "../../components/viz/ArrayBlocks";
import { SceneShell } from "../../components/layout/SceneShell";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { Tone, colors } from "../../design/tokens";
import { LIST_NATIVE } from "../../snippets/list";
import { lineOf } from "../../snippets/lineOf";

/** push 的 6 从右侧飞入的距离（单位：格） */
const FLY_CELLS = 2;
/** 插入 / 删除相位参与搬移的元素个数 */
const SHIFT_COUNT = 3;
/** 排序相位参与移动的元素个数 */
const SORT_COUNT = 4;

type NativeItem = {
  key: string;
  value: number;
  /** 静态槽位（ArrayBlocks 的 key 前缀）：始终等于初始位置 */
  slot: number;
  /** 插入相位位移（0 或 +1） */
  ins: number;
  /** 删除相位位移（0 或 -1） */
  rem: number;
  /** 排序相位位移 */
  sort: number;
  /** 各相位内的搬移次序（带动画交错） */
  insOrder: number;
  remOrder: number;
  sortOrder: number;
  role: "base" | "push";
};

/** splice(3, 0, 0)：索引 3 及之后的元素右移一格 */
const insDelta = (slot: number): number => (slot >= 3 ? 1 : 0);
/** splice(3, 1)：插入后位于索引 4 及之后的元素左移一格 */
const remDelta = (slot: number): number => (slot + insDelta(slot) >= 4 ? -1 : 0);

const RAW: { value: number; slot: number; rank: number; role: "base" | "push" }[] = [
  { value: 1, slot: 0, rank: 0, role: "base" },
  { value: 3, slot: 1, rank: 2, role: "base" },
  { value: 2, slot: 2, rank: 1, role: "base" },
  { value: 5, slot: 3, rank: 4, role: "base" },
  { value: 4, slot: 4, rank: 3, role: "base" },
  { value: 6, slot: 5, rank: 5, role: "push" },
];

const ITEMS: NativeItem[] = RAW.map((it) => {
  const ins = insDelta(it.slot);
  const rem = remDelta(it.slot);
  const current = it.slot + ins + rem;
  return {
    key: `${it.slot}:${it.value}`,
    value: it.value,
    slot: it.slot,
    role: it.role,
    ins,
    rem,
    sort: it.rank - current,
    // 插入：从尾部往回搬；删除：从前面往后搬；排序：按目标位置依次滑动
    insOrder: ins === 1 ? 5 - it.slot : 0,
    remOrder: rem === -1 ? current - 4 : 0,
    sortOrder: it.rank - 1,
  };
});

export const listNativeBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "列表常用操作：push 追加、splice 插入删除、sort 排序",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(LIST_NATIVE, "nums.push(6)")],
    caption: "① nums.push(6)：在列表尾部追加一个元素",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 46,
    caption: "数字 6 从右侧飞入，追加到尾部（绿 → 白）",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 34,
    caption: "nums = [1, 3, 2, 5, 4, 6]，长度变成 6",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(LIST_NATIVE, "nums.splice(3, 0, 0)")],
    caption: "② nums.splice(3, 0, 0)：在索引 3 处插入 0（不删除）",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 56,
    caption: "索引 3 之后的元素整体右移一格，0 插进空出来的位置",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 34,
    caption: "nums = [1, 3, 2, 0, 5, 4, 6]，列表变长到 7",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(LIST_NATIVE, "nums.splice(3, 1)")],
    caption: "③ nums.splice(3, 1)：删除索引 3 处的 1 个元素",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 56,
    caption: "被删元素变红淡出，后面的元素整体左移补位",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 34,
    caption: "0 被删掉了，nums = [1, 3, 2, 5, 4, 6]",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(LIST_NATIVE, "res.sort((a, b) => a - b)")],
    caption: "④ res.sort((a, b) => a - b)：按升序重新排列",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 60,
    caption: "每个格子带着自己的数值，沿橙色轨迹滑到升序位置",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 36,
    caption: "定格：[1, 2, 3, 4, 5, 6] 已经排好序了",
  },
  {
    phase: "caption",
    durationInFrames: 40,
    caption: "列表底层是数组：中间插入 / 删除要搬移元素 → O(n)",
  },
];

const ListNativeViz: React.FC = () => {
  const t = useScene();
  const b = t.beatIndex;
  const insP = t.progressOf(5);
  const remP = t.progressOf(8);
  const sortP = t.progressOf(11);

  /** 相位内交错搬移：order 越小越先动 */
  const stagger = (p: number, order: number, count: number): number => {
    const duration = 0.5;
    const start = count <= 1 ? 0 : (order * (1 - duration)) / (count - 1);
    return between(p, start, start + duration);
  };

  /** 槽位数跟随列表长度；删除左移落位后再收掉尾部空槽 */
  let slots = 6;
  if (b <= 1) slots = 5;
  else if (b <= 4) slots = 6;
  else if (b <= 7) slots = 7;
  else if (b === 8 && remP < 0.95) slots = 7;

  const pushEnter = between(t.frame, t.startOf(2) + 2, t.startOf(2) + 32);
  const insEnter = between(t.frame, t.startOf(5) + 26, t.startOf(5) + 46);
  const remFade = between(remP, 0.06, 0.45);

  const cells: ArrayCell[] = [];

  ITEMS.forEach((it) => {
    const isPush = it.role === "push";
    const enter = between(
      t.frame,
      t.startOf(0) + it.slot * 3,
      t.startOf(0) + it.slot * 3 + 16,
    );

    const dx =
      (isPush ? (1 - pushEnter) * FLY_CELLS : 0) +
      it.ins * stagger(insP, it.insOrder, SHIFT_COUNT) +
      it.rem * stagger(remP, it.remOrder, SHIFT_COUNT) +
      it.sort * stagger(sortP, it.sortOrder, SORT_COUNT);

    let tone: Tone = "default";
    if (isPush && b <= 2) tone = "fresh"; // 追加：绿 → 白
    else if ((b === 4 || b === 5) && it.ins === 1) tone = "focus"; // 右移（橙）
    else if ((b === 7 || b === 8) && it.rem === -1) tone = "focus"; // 左移（橙）
    else if ((b === 10 || b === 11) && it.sort !== 0) tone = "focus"; // 排序（橙）

    cells.push({
      key: it.key,
      value: it.value,
      dx,
      dy: isPush ? 0 : (1 - enter) * 40,
      opacity: isPush ? pushEnter : enter,
      tone,
      scale: isPush ? 0.8 + 0.2 * pushEnter : 1,
      note: isPush && b === 2 && pushEnter > 0.45 ? "push 追加" : undefined,
    });
  });

  // splice(3, 0, 0) 插入的 0：高处落下 → 索引 3；随后在 splice(3, 1) 中变红消失
  const insOpacity = insEnter * (1 - remFade);
  cells.push({
    key: "3:0",
    value: remFade >= 1 ? null : 0,
    dy: (1 - insEnter) * -38,
    opacity: insOpacity,
    tone: b <= 7 ? "focus" : "danger",
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

  const shown =
    b <= 1
      ? "[1, 3, 2, 5, 4]"
      : b <= 4
        ? "[1, 3, 2, 5, 4, 6]"
        : b <= 7
          ? "[1, 3, 2, 0, 5, 4, 6]"
          : b <= 11
            ? "[1, 3, 2, 5, 4, 6]"
            : "[1, 2, 3, 4, 5, 6]";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          fontFamily: "Consolas, monospace",
          color: colors.ink,
          background: colors.bgSoft,
          border: `2px solid ${colors.border}`,
          borderRadius: 12,
          padding: "10px 22px",
          whiteSpace: "nowrap",
        }}
      >
        {`nums = ${shown}`}
      </div>
      <div style={{ position: "relative", width: slots * CELL, height: 200 }}>
        <ArrayBlocks cells={cells} slots={slots} />
      </div>
    </div>
  );
};

export const ListNative: React.FC = () => (
  <SceneShell
    beats={listNativeBeats}
    title="列表常用操作"
    section="4.3 列表"
    code={LIST_NATIVE}
    codeTitle="list.ts"
  >
    <ListNativeViz />
  </SceneShell>
);
