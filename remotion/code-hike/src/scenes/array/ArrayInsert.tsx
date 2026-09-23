import React from "react";
import { ArrayBlocks, ArrayCell, CELL } from "../../components/viz/ArrayBlocks";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { SceneShell } from "../../components/layout/SceneShell";
import {
  Beat,
  between,
  useScene,
} from "../../motion/useSceneProgress";
import { colors } from "../../design/tokens";
import { ARRAY_INSERT } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const IDX = 1;
const NUM = 6;
const VALUES = [1, 3, 2, 5, 4];
/** 需要右移的元素：IDX .. N-2（N-1 会被挤掉） */
const MOVES = N - 1 - IDX;

export const arrayInsertBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "定长数组插入：后面的位置要整体让开一格",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(ARRAY_INSERT, "for (let i = nums.length")],
    caption: "for 从尾部开始，一直往前挪到 index",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 88,
    codeLines: [lineOf(ARRAY_INSERT, "nums[i] = nums[i - 1]")],
    caption: "nums[i] = nums[i-1]：元素依次右移，尾部元素被挤掉",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 24,
    codeLines: [lineOf(ARRAY_INSERT, "nums[index] = num")],
    caption: "index 处空了出来，就是插入点",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 36,
    caption: "nums[index] = num：新元素闪入空位",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "结果 nums = [1, 6, 3, 2, 5]",
  },
  {
    phase: "caption",
    durationInFrames: 34,
    caption: "插入要搬移后面的元素 → 时间复杂度 O(n)",
  },
];

const InsertViz: React.FC = () => {
  const t = useScene();

  // 搬移进度（beat 2）：三个元素依次右移，带交错
  const shiftP = t.progressOf(2);
  const pointer = between(t.frame, t.startOf(1), t.startOf(1) + 12);
  const after = t.beatIndex >= 5;

  const moveOf = (slot: number): number => {
    if (slot < IDX || slot > N - 2) {
      return 0;
    }
    const order = N - 2 - slot;
    const duration = 0.52;
    const start =
      MOVES <= 1 ? 0 : (order * (1 - duration)) / (MOVES - 1);
    const end = start + duration;
    return between(shiftP, start, end);
  };

  const cells: ArrayCell[] = [];
  const enterAt = (slot: number) => t.startOf(0) + slot * 3;

  VALUES.forEach((value, slot) => {
    const enter = between(t.frame, enterAt(slot), enterAt(slot) + 16);
    const isDrop = slot === N - 1;
    const drop = isDrop
      ? between(shiftP, 0.3, 0.56)
      : 0;
    const moving = slot >= IDX && slot <= N - 2;
    const landed = moveOf(slot) >= 1;

    cells.push({
      key: `${slot}:${value}`,
      value,
      dx: moveOf(slot),
      dy: (1 - enter) * 40,
      opacity: enter * (1 - drop),
      tone: isDrop
        ? "danger"
        : after
          ? "default"
          : moving || (slot === IDX && t.beatIndex >= 1)
            ? "focus"
            : "default",
      note: isDrop && drop > 0.05 ? "被挤掉" : undefined,
      scale: moving && moveOf(slot) > 0 && !landed ? 1.04 : 1,
    });
  });

  if (t.beatIndex >= 4) {
    const enter = between(t.frame, t.startOf(4) + 8, t.startOf(4) + 26);
    cells.push({
      key: `${IDX}n:${NUM}`,
      value: NUM,
      opacity: enter,
      scale: 0.7 + 0.3 * enter,
      tone: after ? "fresh" : "focus",
      note: enter > 0.4 ? "新元素" : undefined,
    });
  }

  return (
    <div style={{ position: "relative", width: N * CELL, height: 300 }}>
      <ArrayBlocks cells={cells} slots={N} />
      <PointerArrow
        x={IDX * CELL + CELL / 2}
        y={CELL + 48}
        label={`index = ${IDX}`}
        color={colors.orange}
        opacity={pointer}
        direction="up"
      />
    </div>
  );
};

export const ArrayInsert: React.FC = () => (
  <SceneShell
    beats={arrayInsertBeats}
    title="插入元素"
    section="4.1 数组"
    badge={{ label: "O(n)", tone: "orange" }}
    code={ARRAY_INSERT}
    codeTitle="array.ts"
  >
    <InsertViz />
  </SceneShell>
);
