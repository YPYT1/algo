import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
  LinkedListNodes,
  LLNode,
  NODE_H,
  NODE_W,
} from "../../components/viz/LinkedListNodes";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { colors } from "../../design/tokens";
import { LL_INIT } from "../../snippets/linked-list";
import { lineOf } from "../../snippets/lineOf";

/**
 * ll-init 初始化链表：
 * 5 个节点 n0..n4（值 1,3,2,5,4）先分散错落出现，再按代码逐行画出 4 条箭头。
 * 「先高亮代码行 → 再 stroke 绘制箭头」，每条约 22 帧画完。
 */
const STAGE = { width: 1180, height: 620 };
const STAGE_SCALE = 0.79;

const BASE_NODES: LLNode[] = [
  { id: "n0", name: "n0", val: 1, x: 30, y: 150 },
  { id: "n1", name: "n1", val: 3, x: 260, y: 300 },
  { id: "n2", name: "n2", val: 2, x: 490, y: 150 },
  { id: "n3", name: "n3", val: 5, x: 715, y: 300 },
  { id: "n4", name: "n4", val: 4, x: 940, y: 150 },
];

/** 每条箭头的高亮 beat（6,8,10,12）与绘制 beat（7,9,11,13） */
const HIGHLIGHT_BEATS = [6, 8, 10, 12];
const DRAW_BEATS = [7, 9, 11, 13];
const CHAIN_DONE_BEAT = 14;

export const linkedListInitBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 22,
    caption: "初始化链表：先建 5 个分散的节点，再用 next 把它们串起来",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 26,
    codeLines: [lineOf(LL_INIT, "const n0 = new ListNode")],
    caption: "① const n0 = new ListNode(1)：节点 n0（值 1）落位",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 26,
    codeLines: [lineOf(LL_INIT, "const n1 = new ListNode")],
    caption: "② const n1 = new ListNode(3)：节点 n1（值 3）落位",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 26,
    codeLines: [lineOf(LL_INIT, "const n2 = new ListNode")],
    caption: "③ const n2 = new ListNode(2)：节点 n2（值 2）落位",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 26,
    codeLines: [lineOf(LL_INIT, "const n3 = new ListNode")],
    caption: "④ const n3 = new ListNode(5)：节点 n3（值 5）落位",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 26,
    codeLines: [lineOf(LL_INIT, "const n4 = new ListNode")],
    caption: "⑤ const n4 = new ListNode(4)：节点 n4（值 4）落位",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 20,
    codeLines: [lineOf(LL_INIT, "n0.next = n1")],
    caption: "⑥ n0.next = n1：让 n0 的指针指向 n1",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 40,
    codeLines: [lineOf(LL_INIT, "n0.next = n1")],
    caption: "逐笔画出 n0 → n1 的箭头",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 20,
    codeLines: [lineOf(LL_INIT, "n1.next = n2")],
    caption: "⑦ n1.next = n2：n1 的指针指向 n2",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 40,
    codeLines: [lineOf(LL_INIT, "n1.next = n2")],
    caption: "逐笔画出 n1 → n2 的箭头",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 20,
    codeLines: [lineOf(LL_INIT, "n2.next = n3")],
    caption: "⑧ n2.next = n3：n2 的指针指向 n3",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 40,
    codeLines: [lineOf(LL_INIT, "n2.next = n3")],
    caption: "逐笔画出 n2 → n3 的箭头",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 20,
    codeLines: [lineOf(LL_INIT, "n3.next = n4")],
    caption: "⑨ n3.next = n4：最后一条指针",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 40,
    codeLines: [lineOf(LL_INIT, "n3.next = n4")],
    caption: "画出 n3 → n4，整条链接通",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 42,
    caption: "链表建成：1 → 3 → 2 → 5 → 4",
  },
  {
    phase: "caption",
    durationInFrames: 36,
    caption: "节点分散存放，靠 next 串成一条链",
  },
];

/** 节点右格 → 目标节点左侧的二次贝塞尔箭头，progress 驱动 stroke 逐笔绘制 */
const StrokeArrow: React.FC<{
  readonly from: LLNode;
  readonly to: LLNode;
  readonly progress: number;
  readonly color: string;
}> = ({ from, to, progress, color }) => {
  if (progress <= 0) {
    return null;
  }
  const startX = from.x + NODE_W;
  const startY = from.y + NODE_H / 2;
  const endX = to.x;
  const endY = to.y + NODE_H / 2;
  const ctrlX = (startX + endX) / 2;
  const ctrlY = (startY + endY) / 2;
  const dirX = endX - ctrlX;
  const dirY = endY - ctrlY;
  const len = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / len;
  const uy = dirY / len;
  const tailX = endX - ux * 18;
  const tailY = endY - uy * 18;
  const px = -uy;
  const py = ux;
  const head = `${endX},${endY} ${tailX + px * 9},${tailY + py * 9} ${tailX - px * 9},${tailY - py * 9}`;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${tailX} ${tailY}`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - progress)}
      />
      <polygon points={head} fill={color} opacity={between(progress, 0.82, 1)} />
    </g>
  );
};

const InitViz: React.FC = () => {
  const t = useScene();

  const arrowProgress = DRAW_BEATS.map((beat) =>
    between(t.frame, t.startOf(beat) + 4, t.startOf(beat) + 26),
  );

  const nodes: LLNode[] = BASE_NODES.map((node, i) => {
    const enter = between(t.frame, t.startOf(i + 1) + 2, t.startOf(i + 1) + 16);
    const creating = t.beatIndex === i + 1;
    const rewiring =
      i <= 3 &&
      (t.beatIndex === HIGHLIGHT_BEATS[i] || t.beatIndex === DRAW_BEATS[i]);
    return {
      ...node,
      opacity: enter,
      scale: 0.7 + 0.3 * enter,
      tone:
        t.beatIndex >= CHAIN_DONE_BEAT
          ? "fresh"
          : creating || rewiring
            ? "focus"
            : "default",
    };
  });

  return (
    <div
      style={{
        position: "relative",
        width: STAGE.width,
        height: STAGE.height,
        transform: `scale(${STAGE_SCALE})`,
        transformOrigin: "center center",
      }}
    >
      <LinkedListNodes nodes={nodes} stage={STAGE} scale={1} />
      {/* 箭头逐笔绘制：画的过程中橙（当前操作），落地后蓝（指针） */}
      <svg
        width={STAGE.width}
        height={STAGE.height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 3,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {BASE_NODES.slice(0, 4).map((from, i) => (
          <StrokeArrow
            key={from.id}
            from={from}
            to={BASE_NODES[i + 1]}
            progress={arrowProgress[i]}
            color={arrowProgress[i] >= 1 ? colors.blue : colors.orange}
          />
        ))}
      </svg>
    </div>
  );
};

export const LinkedListInit: React.FC = () => (
  <SceneShell
    beats={linkedListInitBeats}
    title="初始化链表"
    section="4.2 链表"
    code={LL_INIT}
    codeTitle="linked_list.ts"
  >
    <InitViz />
  </SceneShell>
);
