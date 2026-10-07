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
import { LL_ACCESS } from "../../snippets/linked-list";

/**
 * ll-access 访问 index = 3 的节点：
 * 从 head 出发一步步走 —— 当前节点变蓝 + 从它的 next 格画一条蓝箭头到下一个节点，
 * 共 3 步（每条约 18 帧画完），到达 n3（值 5）后橙色脉冲定格。
 */
const STAGE = { width: 1180, height: 620 };
const STAGE_SCALE = 0.79;

const BASE_NODES: LLNode[] = [
	{ id: "n0", name: "n0", val: 1, x: 20, y: 210 },
	{ id: "n1", name: "n1", val: 3, x: 240, y: 210 },
	{ id: "n2", name: "n2", val: 2, x: 460, y: 210 },
	{ id: "n3", name: "n3", val: 5, x: 680, y: 210 },
	{ id: "n4", name: "n4", val: 4, x: 900, y: 210 },
];

/** 三步行走分别从 beat 2 开始 */
const STEP_BEATS = [2, 3, 4];
const TARGET_BEAT = 6;

const BASE_EDGES: LLEdge[] = BASE_NODES.slice(0, 4).map((node, i) => ({
	id: `base-${i}`,
	from: node.id,
	to: BASE_NODES[i + 1].id,
}));

export const linkedListAccessBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 22,
		caption: "访问链表：没有随机访问，只能从 head 一步步走到 index",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(LL_ACCESS, "for (let i = 0; i < index")],
		caption: "① for 循环要走 index 步：目标 index = 3",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 34,
		codeLines: [lineOf(LL_ACCESS, "head = head.next")],
		caption: "第 1 步 head = head.next：n0 → n1（i = 1）",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 34,
		codeLines: [lineOf(LL_ACCESS, "head = head.next")],
		caption: "第 2 步：n1 → n2（i = 2），还在半路",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 34,
		codeLines: [lineOf(LL_ACCESS, "head = head.next")],
		caption: "第 3 步：n2 → n3（i = 3），到达 index = 3",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(LL_ACCESS, "return head")],
		caption: "② return head：返回索引 3 处的节点",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 40,
		codeLines: [lineOf(LL_ACCESS, "return head")],
		caption: "命中目标：n3（值 5）橙色脉冲定格",
	},
	{
		phase: "caption",
		durationInFrames: 36,
		caption: "必须从头走 index 步 → O(n)，与数组的一跳到位形成对比",
	},
];

/** 节点 next 格 → 下一节点的蓝色箭头，逐笔绘制 */
const StrokeArrow: React.FC<{
	readonly from: LLNode;
	readonly to: LLNode;
	readonly progress: number;
}> = ({ from, to, progress }) => {
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
				stroke={colors.blue}
				strokeWidth={5}
				strokeLinecap="round"
				pathLength={100}
				strokeDasharray={100}
				strokeDashoffset={100 * (1 - progress)}
			/>
			<polygon
				points={head}
				fill={colors.blue}
				opacity={between(progress, 0.82, 1)}
			/>
		</g>
	);
};

const AccessViz: React.FC = () => {
	const t = useScene();

	// 每一步的行走进度（step 内 4..22 帧画完一条箭头）
	const steps = STEP_BEATS.map((beat) =>
		between(t.frame, t.startOf(beat) + 4, t.startOf(beat) + 22),
	);
	const targetPulse =
		t.beatIndex === TARGET_BEAT ? 0.5 + 0.5 * Math.sin(t.frame / 3) : 0;

	const arrived = (i: number): boolean => {
		if (i === 0) {
			return t.beatIndex >= 1;
		}
		return steps[i - 1] > 0.65;
	};

	const nodes: LLNode[] = BASE_NODES.map((node, i) => {
		const isTarget = i === 3;
		// 当前 head 所在节点（第 2..4 拍）与到达后的目标节点
		const headHere =
			t.beatIndex >= 2 && t.beatIndex <= 4 && i === t.beatIndex - 2;
		const startHere = i === 0 && t.beatIndex === 1;
		const note = isTarget
			? t.beatIndex >= 6
				? "目标节点 · index = 3"
				: t.beatIndex === 5
					? "head · index = 3"
					: undefined
			: headHere
				? "head"
				: startHere
					? "head（起点）"
					: undefined;

		return {
			...node,
			tone: isTarget
				? t.beatIndex >= TARGET_BEAT
					? "focus"
					: arrived(i)
						? "info"
						: "default"
				: arrived(i)
					? "info"
					: "default",
			scale:
				isTarget && t.beatIndex === TARGET_BEAT ? 1 + 0.05 * targetPulse : 1,
			note,
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
			<LinkedListNodes
				nodes={nodes}
				edges={BASE_EDGES}
				stage={STAGE}
				scale={1}
			/>
			{/* 蓝色行走箭头：每一步从当前节点的 next 格画出 */}
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
				<title>从头节点逐步访问目标链表节点</title>
				{steps.map((progress, i) => (
					<StrokeArrow
						key={BASE_NODES[i].id}
						from={BASE_NODES[i]}
						to={BASE_NODES[i + 1]}
						progress={progress}
					/>
				))}
			</svg>
		</div>
	);
};

export const LinkedListAccess: React.FC = () => (
	<SceneShell
		beats={linkedListAccessBeats}
		title="访问节点"
		section="4.2 链表"
		badge={{ label: "O(n)", tone: "orange" }}
		code={LL_ACCESS}
		codeTitle="linked_list.ts"
	>
		<AccessViz />
	</SceneShell>
);
