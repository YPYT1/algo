import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import { colors, toneStyles } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { lineOf } from "../../snippets/lineOf";
import { LL_NODE } from "../../snippets/linked-list";

/**
 * ll-node 节点结构（书中图 4-5）：
 * 一个大盒子被拆成两格 —— 左格 val（存数值，橙）、右格 next（存指针，蓝）。
 * beats：高亮 val → 左格点亮；高亮 next → 右格点亮并画出向右的箭头（无后继画 null 斜杠）；
 *        高亮 constructor → 两格同时点亮 → 定格总结。
 */
const STAGE = { width: 1180, height: 560 };
const STAGE_SCALE = 0.79;
const BOX = { left: 160, top: 160, width: 700, height: 240 };
const CELL_W = 350;
const MID_Y = BOX.top + BOX.height / 2; // 280：next 箭头所在高度
const BOX_RIGHT = BOX.left + BOX.width; // 860：盒子右边缘
const MONO = "Consolas, monospace";

export const linkedListNodeBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 24,
		caption: "链表节点：一个大盒子，拆开看就是 val 和 next 两格",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(LL_NODE, "val: number")],
		caption: "① val: number：左格用来存数据",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 44,
		codeLines: [lineOf(LL_NODE, "val: number")],
		caption: "左格变橙，填入 val = 1",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(LL_NODE, "next: ListNode")],
		caption: "② next: ListNode | null：右格用来存指针",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 48,
		codeLines: [lineOf(LL_NODE, "next: ListNode")],
		caption: "右格变蓝，画出指向下一个节点的箭头；没有后继就是 null 斜杠",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 28,
		codeLines: [lineOf(LL_NODE, "constructor")],
		caption: "③ constructor(...)：构造时把两个字段装进节点",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 42,
		codeLines: [lineOf(LL_NODE, "constructor")],
		caption: "val 与 next 同时点亮，节点构造完成",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 40,
		caption: "节点 = 数据（val）+ 指向下一个节点的指针（next）",
	},
	{
		phase: "caption",
		durationInFrames: 36,
		caption: "下一节：用 next 把一个个节点串成链表",
	},
];

const NodeViz: React.FC = () => {
	const t = useScene();

	const valLit = t.beatIndex >= 2;
	const valShown = between(t.frame, t.startOf(2) + 6, t.startOf(2) + 22);
	const nextLit = t.beatIndex >= 4;
	const arrowP = between(t.frame, t.startOf(4) + 6, t.startOf(4) + 30);
	const ctorP = between(t.frame, t.startOf(6) + 2, t.startOf(6) + 16);
	const doneP = between(t.frame, t.startOf(7) + 4, t.startOf(7) + 22);
	const lit = t.beatIndex >= 6;
	const pulse = lit ? 0.5 + 0.5 * Math.sin(t.frame / 4) : 0;

	const valSkin = toneStyles[valLit ? "focus" : "default"];
	const nextSkin = toneStyles[nextLit ? "info" : "default"];
	const valLabelColor = t.beatIndex >= 1 ? colors.orange : colors.muted;
	const nextLabelColor = t.beatIndex >= 3 ? colors.blue : colors.muted;
	const dividerColor = valLit
		? valSkin.border
		: nextLit
			? nextSkin.border
			: colors.ink;
	const nullP = between(arrowP, 0.7, 1);

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
			{/* class 名称：与代码面板呼应 */}
			<div
				style={{
					position: "absolute",
					left: BOX.left,
					top: 96,
					fontSize: 28,
					fontWeight: 700,
					fontFamily: MONO,
					color: colors.orange,
					background: colors.orangeTint,
					border: `2px solid ${colors.orange}`,
					borderRadius: 10,
					padding: "4px 16px",
				}}
			>
				class ListNode
			</div>

			{/* 大盒子：左格 val / 右格 next */}
			<div
				style={{
					position: "absolute",
					left: BOX.left,
					top: BOX.top,
					width: BOX.width,
					height: BOX.height,
					display: "flex",
					borderRadius: 18,
					overflow: "hidden",
					border: `5px solid ${lit ? colors.orange : colors.ink}`,
					background: colors.surface,
					boxShadow: lit
						? `0 0 ${16 + 12 * pulse}px rgba(255, 106, 0, ${0.25 + 0.4 * pulse})`
						: "0 8px 0 0 rgba(10, 10, 10, 0.06)",
					transform: `scale(${1 + 0.03 * ctorP})`,
					transformOrigin: "center center",
					zIndex: 2,
				}}
			>
				{/* 左格：val */}
				<div
					style={{
						width: CELL_W,
						height: "100%",
						background: valSkin.bg,
						borderRight: `5px solid ${dividerColor}`,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
					}}
				>
					<span
						style={{
							fontSize: 24,
							fontWeight: 700,
							fontFamily: MONO,
							color: valLabelColor,
						}}
					>
						val : number
					</span>
					<span
						style={{
							fontSize: 92,
							fontWeight: 700,
							fontFamily: MONO,
							color: valSkin.fg,
							opacity: valShown,
							transform: `translateY(${(1 - valShown) * 16}px)`,
						}}
					>
						1
					</span>
				</div>

				{/* 右格：next */}
				<div
					style={{
						flex: 1,
						height: "100%",
						background: nextSkin.bg,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
					}}
				>
					<span
						style={{
							fontSize: 24,
							fontWeight: 700,
							fontFamily: MONO,
							color: nextLabelColor,
						}}
					>
						next : ListNode | null
					</span>
					<span
						style={{
							fontSize: 64,
							fontWeight: 700,
							fontFamily: MONO,
							color: nextSkin.fg,
							opacity: nextLit ? 1 : 0,
							lineHeight: 1,
						}}
					>
						→
					</span>
				</div>
			</div>

			{/* 定格总结 */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 452,
					width: STAGE.width,
					textAlign: "center",
					fontSize: 34,
					fontWeight: 700,
					color: colors.orange,
					opacity: doneP,
				}}
			>
				节点 = 数据 + 指向下一个节点的指针
			</div>

			{/* next 箭头 + null 斜杠（逐笔绘制） */}
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
				<title>链表节点的 next 指针与空指针</title>
				{arrowP > 0 ? (
					<g>
						<path
							d={`M ${BOX_RIGHT} ${MID_Y} L ${BOX_RIGHT + 146} ${MID_Y}`}
							fill="none"
							stroke={colors.blue}
							strokeWidth={6}
							strokeLinecap="round"
							pathLength={100}
							strokeDasharray={100}
							strokeDashoffset={100 * (1 - arrowP)}
						/>
						<polygon
							points={`${BOX_RIGHT + 152},${MID_Y} ${BOX_RIGHT + 132},${MID_Y - 11} ${BOX_RIGHT + 132},${MID_Y + 11}`}
							fill={colors.blue}
							opacity={between(arrowP, 0.85, 1)}
						/>
						{/* 无后继：null 斜杠 */}
						<line
							x1={BOX_RIGHT + 172}
							y1={MID_Y - 26}
							x2={BOX_RIGHT + 206}
							y2={MID_Y + 26}
							stroke={colors.blue}
							strokeWidth={6}
							strokeLinecap="round"
							opacity={nullP}
						/>
						<text
							x={BOX_RIGHT + 218}
							y={MID_Y + 12}
							fill={colors.blue}
							fontSize={32}
							fontWeight={700}
							fontFamily={MONO}
							opacity={nullP}
						>
							null
						</text>
					</g>
				) : null}
			</svg>
		</div>
	);
};

export const LinkedListNode: React.FC = () => (
	<SceneShell
		beats={linkedListNodeBeats}
		title="节点结构"
		section="4.2 链表"
		code={LL_NODE}
		codeTitle="linked_list.ts"
	>
		<NodeViz />
	</SceneShell>
);
