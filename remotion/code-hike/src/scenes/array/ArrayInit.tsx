import React from "react";
import { ArrayBlocks, ArrayCell, CELL } from "../../components/viz/ArrayBlocks";
import { SceneShell } from "../../components/layout/SceneShell";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { colors } from "../../design/tokens";
import { ARRAY_INIT } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const VALUES = [1, 3, 2, 5, 4];
/** 生成错落：每格间隔 3 帧；写入错落：每格间隔 6 帧 */
const ENTER_STEP = 3;
const WRITE_STEP = 6;

export const arrayInitBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "初始化数组：先在内存里申请一段连续空间",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(ARRAY_INIT, "new Array(5).fill(0)")],
    caption: "new Array(5).fill(0)：申请 5 个连续位置，全部填 0",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 64,
    caption: "5 个全 0 方块自上而下错落生成，下标 0..4 同步就位",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(ARRAY_INIT, "[1, 3, 2, 5, 4]")],
    caption: "也可以用初始列表初始化：let nums = [1, 3, 2, 5, 4]",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 56,
    caption: "nums 的每个位置写入新值，橙色闪一下表示写入完成",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "结果 nums = [1, 3, 2, 5, 4]，下标与元素一一对应",
  },
  {
    phase: "caption",
    durationInFrames: 36,
    caption: "数组连续存储，初始化时一次性分配整段内存",
  },
];

/** 顶部字面量读数条：随代码行同步从 arr 切到 nums */
const literalChip: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  fontFamily: "Consolas, monospace",
  color: colors.ink,
  background: colors.bgSoft,
  border: `2px solid ${colors.border}`,
  borderRadius: 14,
  padding: "12px 30px",
  whiteSpace: "nowrap",
};

const InitViz: React.FC = () => {
  const t = useScene();
  const cells: ArrayCell[] = [];
  const shown: number[] = [];

  VALUES.forEach((value, slot) => {
    // ① 方块生成：错落下落入场
    const enterStart = t.startOf(2) + slot * ENTER_STEP;
    const enter = between(t.frame, enterStart, enterStart + 16);
    // ② 数值写入：逐格错开，写完回白
    const writeStart = t.startOf(4) + slot * WRITE_STEP;
    const written = between(t.frame, writeStart, writeStart + 12);
    const flashing =
      t.beatIndex === 4 && t.frame >= writeStart && t.frame <= writeStart + 26;
    const display = written >= 0.5 ? value : 0;
    shown.push(display);

    cells.push({
      key: `${slot}:${value}`,
      value: display,
      dy: (1 - enter) * 40,
      opacity: enter,
      tone: flashing ? "focus" : "default",
      scale: written > 0 && written < 1 ? 1.06 : 1,
    });
  });

  const label = t.beatIndex >= 4 ? "nums" : "arr";
  const chipP = between(t.frame, t.startOf(2), t.startOf(2) + 10);

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
        gap: 72,
      }}
    >
      <div
        style={{
          opacity: chipP,
          transform: `translateY(${(1 - chipP) * 16}px)`,
        }}
      >
        <div style={literalChip}>{`${label} = [${shown.join(", ")}]`}</div>
      </div>
      <div style={{ position: "relative", width: N * CELL, height: 200 }}>
        <ArrayBlocks cells={cells} slots={N} />
      </div>
    </div>
  );
};

export const ArrayInit: React.FC = () => (
  <SceneShell
    beats={arrayInitBeats}
    title="初始化数组"
    section="4.1 数组"
    code={ARRAY_INIT}
    codeTitle="array.ts"
  >
    <InitViz />
  </SceneShell>
);
