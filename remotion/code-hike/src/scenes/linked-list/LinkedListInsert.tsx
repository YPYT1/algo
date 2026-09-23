import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
  LinkedListNodes,
  LLEdge,
  LLNode,
} from "../../components/viz/LinkedListNodes";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { LL_INSERT } from "../../snippets/linked-list";
import { lineOf } from "../../snippets/lineOf";

/**
 * 插入场景舞台（1180×620，整体缩放 0.79 以适配右侧动画区）：
 * 槽位 [n0, P, n1, n2, n3, n4]，P 初始隐藏，正好落在 n0→n1 的箭头上。
 */
const STAGE = { width: 1180, height: 620 };
const STAGE_SCALE = 0.79;

const BASE_NODES: LLNode[] = [
  { id: "n0", name: "n0", val: 1, x: 20, y: 170 },
  { id: "n1", name: "n1", val: 3, x: 376, y: 170 },
  { id: "n2", name: "n2", val: 2, x: 552, y: 250 },
  { id: "n3", name: "n3", val: 5, x: 728, y: 170 },
  { id: "n4", name: "n4", val: 4, x: 904, y: 250 },
];

export const linkedListInsertBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 24,
    caption: "链表插入：不搬元素，只改三个指针",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 28,
    codeLines: [lineOf(LL_INSERT, "const n1 = n0.next")],
    caption: "① const n1 = n0.next：先记住 n0 原来的后继",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 42,
    codeLines: [lineOf(LL_INSERT, "const P = new ListNode")],
    caption: "新节点 P 就位（橙色），正挡在 n0 → n1 的路上",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 24,
    codeLines: [lineOf(LL_INSERT, "P.next = n1")],
    caption: "② P.next = n1：P 接上原来的后半段",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 42,
    caption: "画出 P → n1，P 到 n1 的路先接好",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 24,
    codeLines: [lineOf(LL_INSERT, "n0.next = P")],
    caption: "③ n0.next = P：让 n0 改指到 P",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 44,
    caption: "旧箭头 n0 → n1 断开，改画 n0 → P",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "链表变成 1 → 6 → 3 → 2 → 5 → 4",
  },
  {
    phase: "caption",
    durationInFrames: 34,
    caption: "只改三个指针 → O(1)（前提：已持有前驱 n0）",
  },
];

const InsertViz: React.FC = () => {
  const t = useScene();

  const pIn = between(t.frame, t.startOf(2) + 4, t.startOf(2) + 26);
  const linkP = between(t.frame, t.startOf(4) + 4, t.startOf(4) + 30);
  const rewire = between(t.frame, t.startOf(6) + 4, t.startOf(6) + 30);
  const done = t.beatIndex >= 7;

  const nodes: LLNode[] = BASE_NODES.map((node) => ({
    ...node,
    tone:
      node.id === "n1" && t.beatIndex >= 1 && t.beatIndex <= 6
        ? "info"
        : node.id === "n3" && t.beatIndex >= 3 && t.beatIndex <= 5
          ? "compare"
          : "default",
  }));

  // 新节点 P：从下方升起，落位在 n0 与 n1 之间
  nodes.push({
    id: "P",
    name: "P",
    val: 6,
    x: 200,
    y: 210,
    tone: t.beatIndex >= 7 ? "fresh" : "focus",
    opacity: pIn,
    scale: 0.7 + 0.3 * pIn,
    note: pIn > 0.9 ? "新节点" : undefined,
  });

  const allEdges: LLEdge[] = [
    // ① 保存后继：n0 → n1 高亮（橙），重连时红色断开并淡出
    {
      id: "n0-n1",
      from: "n0",
      to: "n1",
      tone: rewire > 0 ? "danger" : t.beatIndex >= 1 ? "focus" : "default",
      opacity: t.beatIndex >= 6 ? 1 - rewire : 1,
      label: t.beatIndex >= 1 && t.beatIndex < 3 ? "n1 = n0.next" : undefined,
      dashed: t.beatIndex >= 6 && rewire > 0 && rewire < 1,
    },
    // 原本的后半段保持不变
    { id: "n1-n2", from: "n1", to: "n2", tone: "default" },
    { id: "n2-n3", from: "n2", to: "n3", tone: "default" },
    { id: "n3-n4", from: "n3", to: "n4", tone: "default" },
    // ② P → n1
    {
      id: "P-n1",
      from: "P",
      to: "n1",
      tone: "focus",
      opacity: linkP,
      label: linkP > 0.8 ? "P.next = n1" : undefined,
    },
    // ③ n0 → P
    {
      id: "n0-P",
      from: "n0",
      to: "P",
      tone: done ? "fresh" : "focus",
      opacity: rewire,
      label: rewire > 0.8 ? "n0.next = P" : undefined,
    },
  ];
  const edges = allEdges.filter(
    (edge) => !(edge.id === "n0-P" && rewire <= 0),
  );

  return (
    <LinkedListNodes nodes={nodes} edges={edges} stage={STAGE} scale={STAGE_SCALE} />
  );
};

export const LinkedListInsert: React.FC = () => (
  <SceneShell
    beats={linkedListInsertBeats}
    title="插入节点"
    section="4.2 链表"
    badge={{ label: "O(1)", tone: "green" }}
    code={LL_INSERT}
    codeTitle="linked_list.ts"
  >
    <InsertViz />
  </SceneShell>
);

export const linkedListInsertLines = {
  save: lineOf(LL_INSERT, "const n1 = n0.next"),
  link: lineOf(LL_INSERT, "P.next = n1"),
  attach: lineOf(LL_INSERT, "n0.next = P"),
};
