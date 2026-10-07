import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import { ArrayBlocks, type ArrayCell } from "../../components/viz/ArrayBlocks";
import { CapacityBar } from "../../components/viz/CapacityBar";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { lineOf } from "../../snippets/lineOf";
import { MYLIST_RESIZE } from "../../snippets/list";

/** 扩容舞台宽度：正好容纳扩容后的 20 格 */
const STAGE_W = 900;
const BIG_CELL = 100;
/** 扩容前的满数组（10 格全满） */
const FULL = [1, 3, 2, 5, 4, 0, 1, 2, 3, 4];
/** 扩容后追加的新元素（第 11 格） */
const NEW_VALUE = 7;
/** 第 k 个新空槽的出现起点 / 时长（相对扩容相位进度 0..1） */
const SLOT_START = 0.06;
const SLOT_DUR = 0.42;
/** 单个元素的「复制」闪烁窗口 */
const COPY_WINDOW = 0.45;

export const myListResizeBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 20,
		caption: "列表扩容：装满了才扩（此刻 size = capacity = 10，两根条等长）",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(MYLIST_RESIZE, "_size === this._capacity")],
		caption: "① if (_size === _capacity)：装满了，先调用 extendCapacity()",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 48,
		caption: "两根条同时红色脉冲：size == capacity → 触发扩容",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [
			lineOf(MYLIST_RESIZE, "this.arr = this.arr.concat("),
			lineOf(MYLIST_RESIZE, "new Array(this.capacity()"),
		],
		caption:
			"② concat 一个更长的数组：capacity × (extendRatio - 1) 多留 10 个空位",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 66,
		caption:
			"容量 10 → 20（×2）：10 个元素逐个复制，后面错落补出 10 个虚线空槽",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 32,
		codeLines: [
			lineOf(MYLIST_RESIZE, "_capacity = this.arr.length"),
			lineOf(MYLIST_RESIZE, "this.arr[this._size] = num"),
		],
		caption:
			"③ _capacity = arr.length 更新为 20，然后 arr[_size] = num 放入新元素",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 52,
		caption: "新元素（绿色）落地到第 11 格，size 10 → 11",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 40,
		codeLines: [lineOf(MYLIST_RESIZE, "this._size++")],
		caption: "扩容完成：size = 11 / capacity = 20，还剩 9 个空位",
	},
	{
		phase: "caption",
		durationInFrames: 40,
		caption: "扩容要复制所有元素 → 均摊 O(n)（发生得很少）",
	},
];

const ResizeViz: React.FC = () => {
	const t = useScene();
	const b = t.beatIndex;

	/** 扩容相位进度（beat 4：容量 10 → 20 + 补空槽 + 元素复制） */
	const grow = t.progressOf(4);
	const newEnter = between(t.frame, t.startOf(6) + 6, t.startOf(6) + 34);
	const newLanded = b >= 7 || (b === 6 && newEnter >= 1);

	const slotP = (k: number): number =>
		between(grow, k * SLOT_START, k * SLOT_START + SLOT_DUR);

	/** 已开始 / 已落定的新空槽（都是连续前缀） */
	let started = 0;
	let completed = 0;
	for (let k = 0; k < 10; k++) {
		const p = slotP(k);
		if (p > 0) started += 1;
		if (p >= 1) completed += 1;
	}
	const slots = 10 + completed;
	/** 内容随新空槽逐个出现而整体缩小，右缘始终 = STAGE_W（10 格 → 20 格） */
	const scale = STAGE_W / ((10 + started) * BIG_CELL);

	/** 触发扩容：两根条同时红色脉冲 */
	const pulsing = b === 1 || b === 2;
	const pulse = pulsing
		? Math.sin((t.frame - t.startOf(1)) / 3) * 0.5 + 0.5
		: 0;
	const chipIn = between(t.frame, t.startOf(1) + 4, t.startOf(1) + 22);
	const chipOut = between(t.frame, t.startOf(4), t.startOf(4) + 14);
	const chipOpacity = chipIn * (1 - chipOut);

	const capacity = Math.round(10 + 10 * grow);
	const size = 10 + (newLanded ? 1 : 0);

	const cells: ArrayCell[] = [];

	// 扩容前的 10 个元素：扩容相位里按从左到右的绿色波浪「复制」一次
	FULL.forEach((value, slot) => {
		const enter = between(
			t.frame,
			t.startOf(0) + slot * 2,
			t.startOf(0) + slot * 2 + 16,
		);
		const copyStart = slot * 0.05;
		const copying =
			b === 4 && grow > copyStart && grow < copyStart + COPY_WINDOW;
		cells.push({
			key: `${slot}:${value}`,
			value,
			dy: (1 - enter) * 40,
			opacity: enter,
			tone: copying ? "fresh" : "default",
			scale: copying ? 1.06 : 1,
		});
	});

	// 扩容后追加的新元素：第 11 格，绿色落位
	cells.push({
		key: `10:${NEW_VALUE}`,
		value: NEW_VALUE,
		dy: (1 - newEnter) * -38,
		opacity: newEnter,
		tone: "fresh",
		scale: 0.7 + 0.3 * newEnter,
		note: newEnter > 0.45 ? "新元素" : undefined,
	});

	// 10 个新空槽：逐个错落出现（在途的自己画，落定后交给 ArrayBlocks）
	const growSlots: React.ReactNode[] = [];
	for (let k = 0; k < 10; k++) {
		const p = slotP(k);
		if (p <= 0 || p >= 1) {
			continue;
		}
		const index = 10 + k;
		growSlots.push(
			<React.Fragment key={`grow-${index}`}>
				<div
					style={{
						position: "absolute",
						left: index * BIG_CELL + 4,
						top: 4,
						width: BIG_CELL - 8,
						height: BIG_CELL - 8,
						boxSizing: "border-box",
						border: "2px dashed #E3E3E3",
						borderRadius: 14,
						background: "#FCFCFC",
						opacity: p,
						transform: `scale(${0.62 + 0.38 * p})`,
						zIndex: 1,
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: index * BIG_CELL,
						top: BIG_CELL + 8,
						width: BIG_CELL,
						textAlign: "center",
						fontSize: 24,
						fontWeight: 700,
						color: colors.blue,
						fontFamily: "Consolas, monospace",
						opacity: p,
					}}
				>
					{index}
				</div>
			</React.Fragment>,
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 24,
			}}
		>
			{/* 缩放舞台：10 格铺满 900 → 扩容后 20 格仍铺满 900 */}
			<div style={{ position: "relative", width: STAGE_W, height: 190 }}>
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: 20 * BIG_CELL,
						transformOrigin: "0 0",
						transform: `scale(${scale})`,
					}}
				>
					<ArrayBlocks cells={cells} slots={slots} cellSize={BIG_CELL} />
					{growSlots}
				</div>
			</div>

			{/* 触发扩容的红色提示 */}
			<div
				style={{
					width: 884,
					height: 54,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						opacity: chipOpacity,
						transform: `scale(${0.94 + 0.06 * chipOpacity})`,
						background: colors.red,
						color: "#FFFFFF",
						border: `2px solid ${colors.red}`,
						borderRadius: 10,
						padding: "8px 20px",
						fontSize: 26,
						fontWeight: 700,
						fontFamily: "Consolas, monospace",
						whiteSpace: "nowrap",
					}}
				>
					size == capacity → 触发扩容
				</div>
			</div>

			{/* size / capacity 双刻度条：触发时红色脉冲，扩容时 capacity 变绿 10 → 20 */}
			<div
				style={{
					borderRadius: 18,
					padding: 10,
					boxShadow: pulsing
						? `0 0 0 ${(12 * pulse).toFixed(1)}px rgba(255, 45, 45, ${(0.5 * pulse).toFixed(3)})`
						: undefined,
					transform: `scale(${1 + 0.012 * pulse})`,
				}}
			>
				<CapacityBar
					size={size}
					capacity={capacity}
					max={20}
					capacityTone={grow > 0.02 ? "fresh" : "info"}
				/>
			</div>
		</div>
	);
};

export const MyListResize: React.FC = () => (
	<SceneShell
		beats={myListResizeBeats}
		title="列表扩容"
		section="4.3 列表"
		badge={{ label: "O(n)", tone: "orange" }}
		code={MYLIST_RESIZE}
		codeTitle="my_list.ts"
	>
		<ResizeViz />
	</SceneShell>
);
