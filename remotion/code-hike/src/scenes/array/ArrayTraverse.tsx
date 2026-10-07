import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
	ArrayBlocks,
	type ArrayCell,
	CELL,
} from "../../components/viz/ArrayBlocks";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { ARRAY_TRAVERSE } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const VALUES = [1, 3, 2, 5, 4];
/** 每格停留帧数（指针 8 帧落位 + 8 帧停留） */
const STEP = 16;
/** 第一遍下标扫描的 Beat 下标 */
const PASS1 = 2;
/** 第二遍 for...of 扫描的 Beat 下标 */
const PASS2 = 5;

export const arrayTraverseBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 20,
		caption: "遍历数组：把每个元素按顺序访问一遍",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(ARRAY_TRAVERSE, "for (let i = 0")],
		caption: "第一种写法：用下标 i 从 0 走到 nums.length - 1",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 104,
		codeLines: [lineOf(ARRAY_TRAVERSE, "count += nums[i]")],
		caption: "指针扫过每一格，count += nums[i] 累加当前元素",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 38,
		caption: "第一遍结束：count = 1 + 3 + 2 + 5 + 4 = 15",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(ARRAY_TRAVERSE, "for (const num of nums")],
		caption: "第二种写法：for...of 直接取出元素，不用管下标",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 104,
		codeLines: [lineOf(ARRAY_TRAVERSE, "count += num;")],
		caption: "绿色指针再走一遍，count += num 同样逐个累加",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 38,
		caption: "第二遍结束：count = 30；两种写法都访问了全部 n 个元素",
	},
	{
		phase: "caption",
		durationInFrames: 34,
		caption: "遍历必须走完每一个元素 → 时间复杂度 O(n)",
	},
];

const countChip: React.CSSProperties = {
	fontSize: 32,
	fontWeight: 700,
	fontFamily: "Consolas, monospace",
	color: colors.orange,
	background: colors.orangeTint,
	border: `3px solid ${colors.orange}`,
	borderRadius: 14,
	padding: "12px 32px",
	whiteSpace: "nowrap",
};

const TraverseViz: React.FC = () => {
	const t = useScene();

	/** 某一遍已累加的和（指针落位即计入） */
	const passedSum = (startBeat: number): number => {
		let sum = 0;
		for (let i = 0; i < N; i++) {
			if (t.frame >= t.startOf(startBeat) + i * STEP + 10) {
				sum += VALUES[i];
			}
		}
		return sum;
	};
	const count = passedSum(PASS1) + passedSum(PASS2);

	/** 指针的连续位置 0..N-1：每格用 8 帧跳过去再停留 */
	const cursorOf = (startBeat: number): number => {
		let pos = 0;
		for (let i = 0; i < N - 1; i++) {
			const s = t.startOf(startBeat) + (i + 1) * STEP;
			pos += between(t.frame, s + 2, s + 10);
		}
		return pos;
	};

	// 每到一格：短暂变色（第一遍橙、第二遍绿）
	const cells: ArrayCell[] = VALUES.map((value, slot) => {
		const s1 = t.startOf(PASS1) + slot * STEP;
		const s2 = t.startOf(PASS2) + slot * STEP;
		const flash1 = t.frame >= s1 && t.frame <= s1 + 18;
		const flash2 = t.frame >= s2 && t.frame <= s2 + 18;
		return {
			key: `${slot}:${value}`,
			value,
			tone: flash2 ? "fresh" : flash1 ? "focus" : "default",
			scale: flash1 || flash2 ? 1.06 : 1,
		};
	});

	const c1 = cursorOf(PASS1);
	const c2 = cursorOf(PASS2);
	const i1 = Math.min(N - 1, Math.max(0, Math.round(c1)));
	const i2 = Math.min(N - 1, Math.max(0, Math.round(c2)));
	const showP1 = t.beatIndex >= PASS1 && t.beatIndex <= PASS1 + 1;
	const showP2 = t.beatIndex >= PASS2;

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
				gap: 90,
			}}
		>
			<div style={countChip}>{`count = ${count}`}</div>
			<div style={{ position: "relative", width: N * CELL, height: 200 }}>
				<ArrayBlocks cells={cells} slots={N} />
				<PointerArrow
					x={c1 * CELL + CELL / 2}
					y={CELL + 64}
					label={`i = ${i1}`}
					color={colors.orange}
					opacity={
						showP1
							? between(t.frame, t.startOf(PASS1), t.startOf(PASS1) + 6)
							: 0
					}
					direction="up"
				/>
				<PointerArrow
					x={c2 * CELL + CELL / 2}
					y={CELL + 64}
					label={`num = ${VALUES[i2]}`}
					sublabel="for...of 直接取值"
					color={colors.green}
					opacity={
						showP2
							? between(t.frame, t.startOf(PASS2), t.startOf(PASS2) + 6)
							: 0
					}
					direction="up"
				/>
			</div>
		</div>
	);
};

export const ArrayTraverse: React.FC = () => (
	<SceneShell
		beats={arrayTraverseBeats}
		title="遍历数组"
		section="4.1 数组"
		badge={{ label: "O(n)", tone: "orange" }}
		code={ARRAY_TRAVERSE}
		codeTitle="array.ts"
	>
		<TraverseViz />
	</SceneShell>
);
