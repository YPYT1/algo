import React from "react";
import { ArrayBlocks, ArrayCell, CELL } from "../../components/viz/ArrayBlocks";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { SceneShell } from "../../components/layout/SceneShell";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { colors } from "../../design/tokens";
import { ARRAY_REMOVE } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const IDX = 2;
const VALUES = [1, 3, 2, 5, 4];
/** 需要左移的元素：IDX+1 .. N-1 */
const MOVES = N - 1 - IDX;

export const arrayRemoveBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "删除元素：先标记要删的位置 index",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(ARRAY_REMOVE, "for (let i = index")],
    caption: "for 从 index 开始，把后面的元素逐个前移",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 88,
    codeLines: [lineOf(ARRAY_REMOVE, "nums[i] = nums[i + 1]")],
    caption: "nums[i] = nums[i+1]：被删位置变红，后面的元素整体左移",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 44,
    caption: "结果 nums = [1, 3, 5, 4, 4]（长度不变，末尾出现重复）",
  },
  {
    phase: "caption",
    durationInFrames: 40,
    caption: "删除同样要搬移 → 时间复杂度 O(n)",
  },
];

const RemoveViz: React.FC = () => {
  const t = useScene();
  const shiftP = t.progressOf(2);
  const pointer = between(t.frame, t.startOf(1), t.startOf(1) + 12);
  const after = t.beatIndex >= 3;

  /** 源槽位 s（s ∈ [IDX+1, N-1]）被复制到 s-1 的进度 */
  const moveOf = (slot: number): number => {
    if (slot < IDX + 1 || slot > N - 1) {
      return 0;
    }
    const order = slot - (IDX + 1);
    const duration = 0.55;
    const start = MOVES <= 1 ? 0 : (order * (1 - duration)) / (MOVES - 1);
    return between(shiftP, start, start + duration);
  };

  const destroyed = between(shiftP, 0.05, 0.35);
  const cells: ArrayCell[] = [];

  // 原地不动的原始方块（被覆盖的那些会被后来的拷贝盖住）
  VALUES.forEach((value, slot) => {
    const enter = between(
      t.frame,
      t.startOf(0) + slot * 3,
      t.startOf(0) + slot * 3 + 16,
    );
    const isTarget = slot === IDX;
    const tail = slot === N - 1;

    cells.push({
      key: `${slot}:${value}`,
      value: isTarget && destroyed >= 1 ? null : value,
      dy: (1 - enter) * 40,
      opacity: isTarget ? enter * (1 - destroyed) : enter,
      tone: isTarget
        ? "danger"
        : after && tail
          ? "muted"
          : after || isTarget
            ? "default"
            : "default",
      note: isTarget && destroyed > 0.05 && destroyed < 1 ? "删除" : undefined,
      scale: isTarget && destroyed > 0 && destroyed < 1 ? 1 - destroyed * 0.15 : 1,
      dashed: after && tail,
    });
  });

  // nums[i] = nums[i + 1]：源槽位的拷贝整体左移一格
  VALUES.forEach((value, slot) => {
    if (slot < IDX + 1) {
      return;
    }
    const enter = between(
      t.frame,
      t.startOf(0) + slot * 3,
      t.startOf(0) + slot * 3 + 16,
    );
    const p = moveOf(slot);
    cells.push({
      key: `c${slot}:${value}`,
      value,
      dx: -p,
      dy: (1 - enter) * 40,
      opacity: enter,
      tone: after ? "default" : p > 0 ? "focus" : "default",
      note:
        after && slot === N - 1 && p >= 1 ? "重复（长度不变）" : undefined,
    });
  });

  return (
    <div style={{ position: "relative", width: N * CELL, height: 300 }}>
      <ArrayBlocks cells={cells} slots={N} />
      <PointerArrow
        x={IDX * CELL + CELL / 2}
        y={CELL + 48}
        label={`index = ${IDX}`}
        color={colors.red}
        opacity={pointer}
        direction="up"
      />
    </div>
  );
};

export const ArrayRemove: React.FC = () => (
  <SceneShell
    beats={arrayRemoveBeats}
    title="删除元素"
    section="4.1 数组"
    badge={{ label: "O(n)", tone: "orange" }}
    code={ARRAY_REMOVE}
    codeTitle="array.ts"
  >
    <RemoveViz />
  </SceneShell>
);
