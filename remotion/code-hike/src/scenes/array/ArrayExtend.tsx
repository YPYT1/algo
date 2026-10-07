import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import { ArrayBlocks, type ArrayCell } from "../../components/viz/ArrayBlocks";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { ARRAY_EXTEND } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const OLD_N = 5;
const NEW_N = 8;
const VALUES = [1, 3, 2, 5, 4];
/** 上下两排都用 96 的格子，保证 8 格不超框 */
const SMALL = 96;
/** 复制错落：每格间隔 8 帧，单格落下 34 帧 */
const COPY_STEP = 8;
const COPY_DUR = 34;
/** 复制的 Beat 下标 */
const COPY = 4;
/** 旧数组淡出的 Beat 下标 */
const FADE = 5;

export const arrayExtendBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 20,
		caption: "扩容数组：旧数组 nums 长度 5，需要再要 3 个位置",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 32,
		codeLines: [lineOf(ARRAY_EXTEND, "new Array(nums.length + enlarge)")],
		caption: "new Array(5 + 3).fill(0)：先申请一个更长的新数组",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 56,
		caption: "下方生成 8 个连续空槽，前 5 格等着接收旧元素",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(ARRAY_EXTEND, "for (let i = 0; i < nums.length")],
		caption: "for 循环把旧数组的每个元素依次复制过去",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 96,
		codeLines: [lineOf(ARRAY_EXTEND, "res[i] = nums[i]")],
		caption: "res[i] = nums[i]：元素逐个从旧数组复制到新数组（错开 8 帧）",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 44,
		caption: "旧数组淡出变灰，新数组 res 成为主角",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 42,
		codeLines: [lineOf(ARRAY_EXTEND, "return res")],
		caption: "扩容完成：res = [1, 3, 2, 5, 4, 0, 0, 0]",
	},
	{
		phase: "caption",
		durationInFrames: 36,
		caption: "扩容要复制全部 n 个元素 → 时间复杂度 O(n)",
	},
];

/** 行标题（白底实心，复制动画从它后面落下也不会遮字） */
const RowLabel: React.FC<{ text: string; accent: string }> = ({
	text,
	accent,
}) => (
	<div
		style={{
			position: "relative",
			zIndex: 6,
			display: "inline-block",
			fontSize: 24,
			fontWeight: 700,
			fontFamily: "Consolas, monospace",
			color: accent,
			background: colors.bg,
			border: `2px solid ${accent}`,
			borderRadius: 10,
			padding: "6px 18px",
			marginBottom: 14,
			whiteSpace: "nowrap",
		}}
	>
		{text}
	</div>
);

const ExtendViz: React.FC = () => {
	const t = useScene();

	/** 第 slot 个元素的复制进度 */
	const copyOf = (slot: number): number => {
		const start = t.startOf(COPY) + slot * COPY_STEP;
		return between(t.frame, start, start + COPY_DUR);
	};

	// 旧数组：入场 + 复制时橙闪 + 最终淡出变灰
	const oldFade =
		1 - 0.65 * between(t.frame, t.startOf(FADE), t.startOf(FADE) + 26);
	const greying = t.frame >= t.startOf(FADE) + 12;

	const oldCells: ArrayCell[] = VALUES.map((value, slot) => {
		const enter = between(t.frame, slot * 3, slot * 3 + 16);
		const p = copyOf(slot);
		const flying = p > 0 && p < 1;
		return {
			key: `${slot}:${value}`,
			value,
			dy: (1 - enter) * 40,
			opacity: enter * oldFade,
			tone: greying ? "muted" : flying ? "focus" : "default",
		};
	});

	// 新数组容器：第二拍生成
	const appear =
		t.beatIndex >= 2 ? between(t.frame, t.startOf(2), t.startOf(2) + 26) : 0;

	const newCells: ArrayCell[] = [];
	// 后 3 格来自 fill(0)，始终是 0（灰色空值）
	for (let slot = OLD_N; slot < NEW_N; slot++) {
		newCells.push({ key: `${slot}:z`, value: 0, tone: "muted" });
	}
	// 前 5 格：复制时从旧数组位置绿格落下
	VALUES.forEach((value, slot) => {
		const start = t.startOf(COPY) + slot * COPY_STEP;
		if (t.beatIndex < COPY || t.frame < start) {
			return;
		}
		const p = between(t.frame, start, start + COPY_DUR);
		newCells.push({
			key: `${slot}:copy`,
			value,
			dy: (1 - p) * -96,
			opacity: between(t.frame, start, start + 5),
			tone: "fresh",
			scale: p >= 1 ? 1 : 1.04,
		});
	});

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
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 72,
					width: NEW_N * SMALL,
				}}
			>
				<div style={{ opacity: oldFade }}>
					<RowLabel text="nums（长度 5）" accent={colors.orange} />
					<ArrayBlocks cells={oldCells} slots={OLD_N} cellSize={SMALL} />
				</div>
				<div
					style={{
						opacity: appear,
						transform: `translateY(${(1 - appear) * 30}px)`,
					}}
				>
					<RowLabel text="res（长度 8）" accent={colors.green} />
					<ArrayBlocks cells={newCells} slots={NEW_N} cellSize={SMALL} />
				</div>
			</div>
		</div>
	);
};

export const ArrayExtend: React.FC = () => (
	<SceneShell
		beats={arrayExtendBeats}
		title="扩容数组"
		section="4.1 数组"
		badge={{ label: "O(n)", tone: "orange" }}
		code={ARRAY_EXTEND}
		codeTitle="array.ts"
	>
		<ExtendViz />
	</SceneShell>
);
