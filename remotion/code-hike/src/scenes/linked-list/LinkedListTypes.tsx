import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
	LinkedListNodes,
	type LLEdge,
	type LLNode,
	NODE_H,
	NODE_W,
} from "../../components/viz/LinkedListNodes";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { lineOf } from "../../snippets/lineOf";
import { LL_TYPES } from "../../snippets/linked-list";

/**
 * ll-types 常见链表类型（书中图 4-8）：
 * 右侧舞台分三行 —— 单链表 / 环形链表 / 双向链表，随 beats 依次点亮
 * （未点亮 0.25 opacity，点亮 1，最后一拍三个同时点亮定格）。
 */
const STAGE = { width: 640, height: 175 };
const MONO = "Consolas, monospace";
const PURPLE = colors.purple;

const ROW_NODES: LLNode[] = [
	{ id: "a", val: 1, x: 10, y: 40 },
	{ id: "b", val: 3, x: 230, y: 40 },
	{ id: "c", val: 2, x: 450, y: 40 },
];

const RING_NODES: LLNode[] = ROW_NODES.map((node) =>
	node.id === "a"
		? { ...node, name: "head" }
		: node.id === "c"
			? { ...node, name: "tail" }
			: node,
);

/** 单向：橙色实线 next */
const SINGLE_EDGES: LLEdge[] = [
	{ id: "s1", from: "a", to: "b", tone: "focus", label: "next" },
	{ id: "s2", from: "b", to: "c", tone: "focus" },
];

/** 环形：尾节点的 next 用虚线橙色弧线绕回头节点 */
const RING_EDGES: LLEdge[] = [
	{ id: "r1", from: "a", to: "b", tone: "focus" },
	{ id: "r2", from: "b", to: "c", tone: "focus" },
	{ id: "loop", from: "c", to: "a", tone: "focus", dashed: true, bend: 140 },
];

/** 双向：next 仍是向右橙箭头；prev 用本文件的 SVG 在节点下方画紫色向左箭头 */
const DOUBLE_EDGES: LLEdge[] = [
	{ id: "d1", from: "a", to: "b", tone: "focus", label: "next" },
	{ id: "d2", from: "b", to: "c", tone: "focus" },
];

const A_C = ROW_NODES[0].x + NODE_W / 2; // 88
const B_C = ROW_NODES[1].x + NODE_W / 2; // 308
const C_C = ROW_NODES[2].x + NODE_W / 2; // 528
const BOTTOM = ROW_NODES[0].y + NODE_H; // 144
const LINE_Y = 166;

export const linkedListTypesBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 24,
		caption: "常见链表类型：单链表、环形链表、双向链表",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 44,
		codeLines: [lineOf(LL_TYPES, "head.next = node1")],
		caption: "① 单链表：节点只保存 next，只能单向遍历",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 46,
		codeLines: [lineOf(LL_TYPES, "tail.next = head")],
		caption: "② 环形链表：尾节点的 next 用虚线指回头节点，可循环轮转",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 46,
		codeLines: [lineOf(LL_TYPES, "class DoublyListNode")],
		caption: "③ 双向链表：每个节点还保存 prev（紫色），可以反向走",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 42,
		caption: "三种结构各有分工：单向省空间、环形可轮转、双向能回头",
	},
	{
		phase: "caption",
		durationInFrames: 34,
		caption: "默认单链表；需要反向遍历用双向；需要循环队列用环形",
	},
];

/** 双向链表的 prev 箭头：节点下方两条紫色向左线段，逐笔绘制 */
const PrevArrows: React.FC<{ readonly progress: number }> = ({ progress }) => {
	const p1 = between(progress, 0, 0.55); // c → b
	const p2 = between(progress, 0.45, 1); // b → a
	const stub528 = between(progress, 0.05, 0.2);
	const stub308 = between(progress, 0.5, 0.65);
	const stub88 = between(progress, 0.9, 1);
	const head308 = between(progress, 0.5, 0.62);
	const head88 = between(progress, 0.95, 1);

	return (
		<g>
			{/* 竖直引线 */}
			<line
				x1={C_C}
				y1={BOTTOM}
				x2={C_C}
				y2={LINE_Y}
				stroke={PURPLE}
				strokeWidth={5}
				opacity={stub528}
			/>
			<line
				x1={B_C}
				y1={BOTTOM}
				x2={B_C}
				y2={LINE_Y}
				stroke={PURPLE}
				strokeWidth={5}
				opacity={stub308}
			/>
			<line
				x1={A_C}
				y1={BOTTOM}
				x2={A_C}
				y2={LINE_Y}
				stroke={PURPLE}
				strokeWidth={5}
				opacity={stub88}
			/>
			{/* c → b */}
			<line
				x1={C_C}
				y1={LINE_Y}
				x2={C_C - 220 * p1}
				y2={LINE_Y}
				stroke={PURPLE}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<polygon
				points={`${B_C},${LINE_Y} ${B_C + 22},${LINE_Y - 9} ${B_C + 22},${LINE_Y + 9}`}
				fill={PURPLE}
				opacity={head308}
			/>
			{/* b → a */}
			<line
				x1={B_C}
				y1={LINE_Y}
				x2={B_C - 220 * p2}
				y2={LINE_Y}
				stroke={PURPLE}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<polygon
				points={`${A_C},${LINE_Y} ${A_C + 22},${LINE_Y - 9} ${A_C + 22},${LINE_Y + 9}`}
				fill={PURPLE}
				opacity={head88}
			/>
			{/* prev 标注 */}
			<text
				x={(C_C + B_C) / 2}
				y={LINE_Y - 10}
				textAnchor="middle"
				fill={PURPLE}
				fontSize={24}
				fontWeight={700}
				fontFamily={MONO}
				opacity={p1}
			>
				prev
			</text>
			<text
				x={(B_C + A_C) / 2}
				y={LINE_Y - 10}
				textAnchor="middle"
				fill={PURPLE}
				fontSize={24}
				fontWeight={700}
				fontFamily={MONO}
				opacity={p2}
			>
				prev
			</text>
		</g>
	);
};

const chipSkin = {
	color: colors.orange,
	background: colors.orangeTint,
};

const Row: React.FC<{
	readonly label: string;
	readonly opacity: number;
	readonly children: React.ReactNode;
}> = ({ label, opacity, children }) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			gap: 20,
			width: 860,
			opacity,
		}}
	>
		<div
			style={{
				width: 170,
				flexShrink: 0,
				textAlign: "center",
				padding: "12px 0",
				fontSize: 28,
				fontWeight: 700,
				color: chipSkin.color,
				background: chipSkin.background,
				border: `3px solid ${colors.orange}`,
				borderRadius: 12,
			}}
		>
			{label}
		</div>
		<div
			style={{ position: "relative", width: STAGE.width, height: STAGE.height }}
		>
			{children}
		</div>
	</div>
);

const TypesViz: React.FC = () => {
	const t = useScene();

	/** 第 i 行（beat = i + 1）的点亮进度：未点亮 0.25，点亮时 0.25 → 1 */
	const litOf = (beat: number): number => {
		if (t.beatIndex > beat) {
			return 1;
		}
		if (t.beatIndex === beat) {
			return (
				0.25 +
				0.75 * between(t.frame, t.startOf(beat) + 2, t.startOf(beat) + 16)
			);
		}
		return 0.25;
	};

	const prevP = between(t.frame, t.startOf(3) + 8, t.startOf(3) + 40);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 18,
				width: 860,
				height: 570,
			}}
		>
			{/* 1. 单链表 */}
			<Row label="单链表" opacity={litOf(1)}>
				<LinkedListNodes
					nodes={ROW_NODES}
					edges={SINGLE_EDGES}
					stage={STAGE}
					scale={1}
				/>
			</Row>

			{/* 2. 环形链表 */}
			<Row label="环形链表" opacity={litOf(2)}>
				<LinkedListNodes
					nodes={RING_NODES}
					edges={RING_EDGES}
					stage={STAGE}
					scale={1}
				/>
			</Row>

			{/* 3. 双向链表 */}
			<Row label="双向链表" opacity={litOf(3)}>
				<LinkedListNodes
					nodes={ROW_NODES}
					edges={DOUBLE_EDGES}
					stage={STAGE}
					scale={1}
				/>
				{prevP > 0 ? (
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
						<title>双向链表指向前驱节点的指针</title>
						<PrevArrows progress={prevP} />
					</svg>
				) : null}
			</Row>
		</div>
	);
};

export const LinkedListTypes: React.FC = () => (
	<SceneShell
		beats={linkedListTypesBeats}
		title="常见链表类型"
		section="4.2 链表"
		code={LL_TYPES}
		codeTitle="linked_list.ts"
	>
		<TypesViz />
	</SceneShell>
);
