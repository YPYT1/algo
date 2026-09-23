import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import { ArrayBlocks, ArrayCell } from "../../components/viz/ArrayBlocks";
import { CompareRow, CompareTable } from "../../components/viz/CompareTable";
import { PointerArrow } from "../../components/viz/PointerArrow";
import {
  LinkedListNodes,
  LLEdge,
  LLNode,
} from "../../components/viz/LinkedListNodes";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { colors } from "../../design/tokens";
import { LL_VS_ARRAY } from "../../snippets/linked-list";
import { lineOf } from "../../snippets/lineOf";

/**
 * ll-vs-array（书中表 4-1 + 访问对比硬指标）：
 * 上栏 CompareTable 逐行高亮；下栏「数组一跳 vs 链表逐跳」同时开始的访问小演示。
 */
const ROWS: CompareRow[] = [
  { label: "存储方式", array: "连续", linkedList: "分散", winner: "array" },
  { label: "访问元素", array: "O(1)", linkedList: "O(n)", winner: "array" },
  { label: "插入删除", array: "O(n)", linkedList: "O(1)", winner: "linked" },
  { label: "适用场景", array: "随机访问", linkedList: "频繁增删", winner: "linked" },
];

/** 各拍高亮的表格行（-1 = 不高亮） */
const ROW_HIGHLIGHT = [-1, 0, 1, 2, 2, 3, 1, 1, -1];
const DEMO_BEAT = 6;

const DEMO_VALUES = [1, 3, 2, 5];
const DEMO_CELL = 100;
const ARR_LEFT = 6;
const ARR_TOP = 40;

const CHAIN_SCALE = 0.55;
const CHAIN_STAGE = { width: 744, height: 130 };
const CHAIN_LEFT = 273;
const CHAIN_TOP = 60;
/** LinkedListNodes 以中心缩放：视觉左边界 = 容器左 + stage 宽的缩进 */
const CHAIN_VISUAL_LEFT =
  CHAIN_LEFT + (CHAIN_STAGE.width * (1 - CHAIN_SCALE)) / 2;

const CHAIN_NODES: LLNode[] = DEMO_VALUES.map((value, i) => ({
  id: `c${i}`,
  val: value,
  x: i * 196,
  y: 13,
}));

const CHAIN_EDGES: LLEdge[] = CHAIN_NODES.slice(0, 3).map((node, i) => ({
  id: `c-${i}`,
  from: node.id,
  to: CHAIN_NODES[i + 1].id,
}));

export const linkedListVsArrayBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 24,
    caption: "数组 vs 链表：同样一份数据，两种组织方式，各有取舍",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 34,
    caption: "存储方式：数组连续存放，链表分散在内存各处",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 34,
    caption: "访问元素：数组按公式一跳到位 O(1)，链表必须逐个走 O(n)",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 28,
    codeLines: [lineOf(LL_VS_ARRAY, "for (let i = nums.length")],
    caption: "数组的插入删除：for 循环搬移后面所有元素 → O(n)",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [lineOf(LL_VS_ARRAY, "P.next = n1")],
    caption: "链表的插入删除：只改三个指针 → O(1)（已持有前驱）",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 30,
    caption: "适用场景：数组适合随机访问，链表适合频繁增删",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 66,
    codeLines: [],
    caption: "访问对比：数组指针一跳到底，链表指针逐跳前进（同时开始）",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 36,
    codeLines: [],
    caption: "数组一跳到位 O(1)；链表必须逐步走 O(n)",
  },
  {
    phase: "caption",
    durationInFrames: 36,
    codeLines: [],
    caption: "取舍：要随机访问选数组，要频繁增删选链表",
  },
];

const chipStyle = (background: string): React.CSSProperties => ({
  fontSize: 26,
  fontWeight: 700,
  color: "#FFFFFF",
  background,
  borderRadius: 10,
  padding: "6px 18px",
  whiteSpace: "nowrap",
});

const VsArrayViz: React.FC = () => {
  const t = useScene();

  // 下栏访问对比：数组一跳（4..18 帧） vs 链表三次逐跳（每次 16 帧）
  const jumpP = between(t.frame, t.startOf(DEMO_BEAT) + 4, t.startOf(DEMO_BEAT) + 18);
  const hops = [0, 1, 2].map((i) =>
    between(
      t.frame,
      t.startOf(DEMO_BEAT) + 6 + i * 16,
      t.startOf(DEMO_BEAT) + 22 + i * 16,
    ),
  );
  const demoOn = t.beatIndex >= DEMO_BEAT;

  // 数组：指针从 index 0 一跳到 index 3
  const cells: ArrayCell[] = DEMO_VALUES.map((value, i) => ({
    key: `${i}:${value}`,
    value,
    tone: i === 3 && jumpP > 0.9 ? "info" : "default",
  }));

  // 链表：head 逐跳前进，到过的节点变蓝
  const chainNodes: LLNode[] = CHAIN_NODES.map((node, i) => {
    const arrived = i === 0 ? demoOn : hops[i - 1] > 0.9;
    return { ...node, tone: arrived ? "info" : "default" };
  });
  const hopX =
    78 + 196 * hops[0] + 196 * hops[1] + 196 * hops[2];

  return (
    <div style={{ position: "relative", width: 900, height: 670 }}>
      {/* 上栏：对比表逐行高亮 */}
      <div style={{ position: "absolute", left: 40, top: 0 }}>
        <CompareTable rows={ROWS} highlight={ROW_HIGHLIGHT[t.beatIndex]} />
      </div>

      {/* 下栏：访问对比小演示 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 368,
          width: 900,
          height: 300,
        }}
      >
        <div style={{ position: "absolute", left: ARR_LEFT, top: 0 }}>
          <span style={chipStyle(colors.blue)}>数组 · 一跳到位</span>
        </div>
        <div style={{ position: "absolute", left: 470, top: 0 }}>
          <span style={chipStyle(colors.purple)}>链表 · 逐跳前进</span>
        </div>

        {/* 左：4 格数组 */}
        <div style={{ position: "absolute", left: ARR_LEFT, top: ARR_TOP }}>
          <ArrayBlocks cells={cells} cellSize={DEMO_CELL} />
        </div>
        <PointerArrow
          x={ARR_LEFT + 50 + jumpP * 3 * DEMO_CELL}
          y={ARR_TOP + DEMO_CELL + 48}
          label="index = 3"
          color={colors.blue}
          opacity={demoOn ? 1 : 0}
          direction="up"
        />

        {/* 右：4 节点链表（整体缩放到半栏内） */}
        <div
          style={{
            position: "absolute",
            left: CHAIN_LEFT,
            top: CHAIN_TOP,
            width: CHAIN_STAGE.width,
            height: CHAIN_STAGE.height,
          }}
        >
          <LinkedListNodes
            nodes={chainNodes}
            edges={CHAIN_EDGES}
            stage={CHAIN_STAGE}
            scale={CHAIN_SCALE}
          />
        </div>
        <PointerArrow
          x={CHAIN_VISUAL_LEFT + hopX * CHAIN_SCALE}
          y={CHAIN_TOP + 98}
          label="head"
          color={colors.blue}
          opacity={demoOn ? 1 : 0}
          direction="up"
        />
      </div>
    </div>
  );
};

export const LinkedListVsArray: React.FC = () => (
  <SceneShell
    beats={linkedListVsArrayBeats}
    title="数组 vs 链表"
    section="4.2 链表"
    badge={{ label: "对比", tone: "blue" }}
    code={LL_VS_ARRAY}
    codeTitle="linked_list.ts"
  >
    <VsArrayViz />
  </SceneShell>
);
