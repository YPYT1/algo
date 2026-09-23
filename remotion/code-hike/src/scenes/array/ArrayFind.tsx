import React from "react";
import { interpolate } from "remotion";
import { ArrayBlocks, ArrayCell, CELL } from "../../components/viz/ArrayBlocks";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { SceneShell } from "../../components/layout/SceneShell";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { Tone, colors } from "../../design/tokens";
import { ARRAY_FIND } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const VALUES = [1, 3, 2, 5, 4];
const HIT = 1;
/** 第二段（target = 9）扫描的 Beat 下标 */
const SCAN2 = 7;
/** 返回 -1 的 Beat 下标 */
const MISS = 8;

export const arrayFindBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "线性查找：target = 3，从下标 0 开始逐个比较",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(ARRAY_FIND, "for (let i = 0")],
    caption: "for 循环从头扫到尾，逐个取出 nums[i]",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 44,
    codeLines: [lineOf(ARRAY_FIND, "if (nums[i] === target")],
    caption: "nums[0] = 1 ≠ 3：不相等，继续往后比",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 44,
    codeLines: [lineOf(ARRAY_FIND, "return i;")],
    caption: "nums[1] = 3 === 3：命中！return i 返回下标 1",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "找到了：target 3 就在 index = 1（定格）",
  },
  {
    phase: "caption",
    durationInFrames: 34,
    caption: "再看反例：target = 9 在数组里根本不存在",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(ARRAY_FIND, "for (let i = 0")],
    caption: "换成 target = 9，仍然从头开始比较",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 78,
    codeLines: [lineOf(ARRAY_FIND, "if (nums[i] === target")],
    caption: "1、3、2、5、4 逐个比较，全都 ≠ 9",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 40,
    codeLines: [lineOf(ARRAY_FIND, "return -1")],
    caption: "循环结束仍然没命中 → 标红提示 return -1",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "没找到返回 -1：最多要把 n 个元素全部比一遍",
  },
  {
    phase: "caption",
    durationInFrames: 36,
    caption: "线性查找要逐个比较 → 时间复杂度 O(n)",
  },
];

const chipBase: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  fontFamily: "Consolas, monospace",
  borderRadius: 14,
  padding: "12px 30px",
  whiteSpace: "nowrap",
};

const FindViz: React.FC = () => {
  const t = useScene();

  // 第一段：指针在 0 停留比较，随后跳到命中位 1
  const move = between(t.frame, t.startOf(3) + 4, t.startOf(3) + 16);
  const p1x = move * CELL + CELL / 2;
  const p1Label = `i = ${move >= 1 ? HIT : 0}`;
  const showP1 = t.beatIndex >= 2 && t.beatIndex < 6;

  // 第二段：指针 14 帧一格扫完全数组
  let pos = 0;
  for (let i = 0; i < N - 1; i++) {
    const s = t.startOf(SCAN2) + (i + 1) * 14;
    pos += between(t.frame, s + 2, s + 9);
  }
  const showP2 = t.beatIndex >= 6;

  // 命中弹跳
  const hitF = t.since(3);
  const bounce = interpolate(hitF, [0, 10, 18, 28, 44], [1, 1.24, 0.98, 1.1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 未命中：全部红框闪一下再回白
  const redP =
    t.beatIndex >= MISS
      ? interpolate(t.since(MISS), [0, 5, 22, 34], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const cells: ArrayCell[] = VALUES.map((value, slot) => {
    let tone: Tone = "default";
    let note: string | undefined;
    let scale = 1;

    if (t.beatIndex >= MISS) {
      tone = redP > 0.5 ? "danger" : "default";
    } else if (t.beatIndex >= SCAN2) {
      const s = t.startOf(SCAN2) + slot * 14;
      if (t.frame >= s && t.frame <= s + 20) {
        tone = "compare";
        note = `${value} ≠ 9`;
      }
    } else if (t.beatIndex < 6) {
      // 第一段：0 ≠ 3（紫），1 === 3（橙命中）；换 target 时复位
      if (t.beatIndex >= 2 && slot === 0) {
        tone = "compare";
        note = "1 ≠ 3";
      }
      if (t.beatIndex >= 3 && slot === HIT) {
        tone = "focus";
        note = "3 = 3 命中";
        scale = bounce;
      }
    }

    return {
      key: `${slot}:${value}`,
      value,
      tone,
      note,
      scale,
    };
  });

  const miss = t.beatIndex >= MISS;
  const showReturn =
    (t.beatIndex >= 3 && t.beatIndex < 6) || t.beatIndex >= MISS;
  const returnStart = t.startOf(miss ? MISS : 3);
  const returnP = between(t.frame, returnStart, returnStart + 12);
  const target = t.beatIndex >= 6 ? 9 : 3;
  const targetP =
    t.beatIndex >= 6 ? between(t.frame, t.startOf(6), t.startOf(6) + 10) : 1;

  return (
    <div
      style={{
        position: "relative",
        width: 938,
        height: 782,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 120,
      }}
    >
      <div
        key={`t${target}`}
        style={{
          ...chipBase,
          opacity: targetP,
          color: colors.purple,
          background: colors.purpleTint,
          border: `3px solid ${colors.purple}`,
        }}
      >
        {`target = ${target}`}
      </div>

      <div style={{ position: "relative", width: N * CELL, height: 200 }}>
        <ArrayBlocks cells={cells} slots={N} />
        <PointerArrow
          x={p1x}
          y={CELL + 64}
          label={p1Label}
          color={colors.orange}
          opacity={showP1
            ? between(t.frame, t.startOf(2) + 4, t.startOf(2) + 14)
            : 0}
          direction="up"
        />
        <PointerArrow
          x={pos * CELL + CELL / 2}
          y={CELL + 64}
          label={`i = ${Math.min(N - 1, Math.max(0, Math.round(pos)))}`}
          color={colors.orange}
          opacity={showP2 ? between(t.frame, t.startOf(6), t.startOf(6) + 8) : 0}
          direction="up"
        />
      </div>

      <div
        style={{
          ...chipBase,
          opacity: showReturn ? returnP : 0,
          color: miss ? colors.redAlt : colors.orange,
          background: miss ? colors.redTint : colors.orangeTint,
          border: `3px solid ${miss ? colors.red : colors.orange}`,
          transform: `translateY(${(1 - returnP) * 14}px)`,
        }}
      >
        {miss ? "return -1" : `return ${HIT}`}
      </div>
    </div>
  );
};

export const ArrayFind: React.FC = () => (
  <SceneShell
    beats={arrayFindBeats}
    title="查找元素"
    section="4.1 数组"
    badge={{ label: "O(n)", tone: "orange" }}
    code={ARRAY_FIND}
    codeTitle="array.ts"
  >
    <FindViz />
  </SceneShell>
);
