import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
	LinkedListNodes,
	type LLEdge,
	type LLNode,
} from "../../components/viz/LinkedListNodes";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { lineOf } from "../../snippets/lineOf";
import { LL_FIND } from "../../snippets/linked-list";

/**
 * ll-find 查找 target = 2：
 * 逐个比较 val —— n0(1)≠2 灰、n1(3)≠2 灰、n2(2)==2 橙圈圈中并 return index = 2。
 */
const STAGE = { width: 1180, height: 620 };
const STAGE_SCALE = 0.79;
const MONO = "Consolas, monospace";

const BASE_NODES: LLNode[] = [
	{ id: "n0", name: "n0", val: 1, x: 20, y: 210 },
	{ id: "n1", name: "n1", val: 3, x: 240, y: 210 },
	{ id: "n2", name: "n2", val: 2, x: 460, y: 210 },
	{ id: "n3", name: "n3", val: 5, x: 680, y: 210 },
	{ id: "n4", name: "n4", val: 4, x: 900, y: 210 },
];

const BASE_EDGES: LLEdge[] = BASE_NODES.slice(0, 4).map((node, i) => ({
	id: `base-${i}`,
	from: node.id,
	to: BASE_NODES[i + 1].id,
}));

const TARGET = BASE_NODES[2]; // 命中节点 n2（值 2）

export const linkedListFindBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 22,
		caption: "查找链表：拿着 target 逐个问每个节点的 val",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(LL_FIND, "while (head !== null)")],
		caption: "① while (head !== null)：从头开始逐个比较",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 36,
		codeLines: [lineOf(LL_FIND, "if (head.val === target)")],
		caption: "比较 ①：n0.val = 1 ≠ 2 → 不是它，变灰继续往后",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 36,
		codeLines: [lineOf(LL_FIND, "if (head.val === target)")],
		caption: "比较 ②：n1.val = 3 ≠ 2 → 不是它，继续往后",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(LL_FIND, "if (head.val === target)")],
		caption: "比较 ③：n2.val = 2，与 target 相等 → 命中！",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 40,
		codeLines: [lineOf(LL_FIND, "return index")],
		caption: "return index：橙圈圈中 n2，返回下标 2",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 38,
		caption: "命中即返回 index = 2；整条链都没找到则返回 -1",
	},
	{
		phase: "caption",
		durationInFrames: 34,
		caption: "链表查找必须逐个比较 → 时间复杂度 O(n)",
	},
];

const FindViz: React.FC = () => {
	const t = useScene();

	const ringP = between(t.frame, t.startOf(5) + 4, t.startOf(5) + 26);
	const chipP = between(t.frame, t.startOf(5) + 16, t.startOf(5) + 32);
	const hitPulse = t.beatIndex === 6 ? 0.5 + 0.5 * Math.sin(t.frame / 3.5) : 0;

	const nodes: LLNode[] = BASE_NODES.map((node, i) => {
		if (i === 0) {
			return {
				...node,
				tone: t.beatIndex >= 2 ? "muted" : "default",
				note: t.beatIndex >= 2 ? "1 ≠ 2" : undefined,
			};
		}
		if (i === 1) {
			return {
				...node,
				tone: t.beatIndex >= 3 ? "muted" : "default",
				note: t.beatIndex >= 3 ? "3 ≠ 2" : undefined,
			};
		}
		if (i === 2) {
			return {
				...node,
				tone: t.beatIndex >= 4 ? "focus" : "default",
				note: t.beatIndex >= 4 ? "2 == 2 ✓ 命中" : undefined,
				scale: t.beatIndex === 6 ? 1 + 0.04 * hitPulse : 1,
			};
		}
		return { ...node };
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
			<LinkedListNodes
				nodes={nodes}
				edges={BASE_EDGES}
				stage={STAGE}
				scale={1}
			/>

			{/* 橙色命中圈（逐笔绘制） */}
			{ringP > 0 ? (
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
					<title>已找到的目标链表节点</title>
					<rect
						x={TARGET.x - 14}
						y={TARGET.y - 14}
						width={184}
						height={132}
						rx={24}
						fill="none"
						stroke={colors.orange}
						strokeWidth={6}
						pathLength={100}
						strokeDasharray={100}
						strokeDashoffset={100 * (1 - ringP)}
					/>
				</svg>
			) : null}

			{/* return index 提示 */}
			{t.beatIndex >= 5 ? (
				<div
					style={{
						position: "absolute",
						left: TARGET.x + 78,
						top: TARGET.y - 104,
						transform: `translateX(-50%) scale(${0.8 + 0.2 * chipP})`,
						transformOrigin: "center center",
						opacity: chipP,
						zIndex: 4,
						fontSize: 28,
						fontWeight: 700,
						fontFamily: MONO,
						color: "#FFFFFF",
						background: colors.orange,
						borderRadius: 10,
						padding: "6px 18px",
						whiteSpace: "nowrap",
					}}
				>
					return 2
				</div>
			) : null}
		</div>
	);
};

export const LinkedListFind: React.FC = () => (
	<SceneShell
		beats={linkedListFindBeats}
		title="查找节点"
		section="4.2 链表"
		badge={{ label: "O(n)", tone: "orange" }}
		code={LL_FIND}
		codeTitle="linked_list.ts"
	>
		<FindViz />
	</SceneShell>
);
