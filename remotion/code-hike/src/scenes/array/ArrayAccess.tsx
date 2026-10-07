import type React from "react";
import { interpolate } from "remotion";
import { SceneShell } from "../../components/layout/SceneShell";
import {
	ArrayBlocks,
	type ArrayCell,
	CELL,
} from "../../components/viz/ArrayBlocks";
import { MemoryAddressFormula } from "../../components/viz/MemoryAddressFormula";
import { PointerArrow } from "../../components/viz/PointerArrow";
import { colors } from "../../design/tokens";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { ARRAY_ACCESS } from "../../snippets/array";
import { lineOf } from "../../snippets/lineOf";

const N = 5;
const INDEX = 3;
const VALUES = [1, 3, 2, 5, 4];

export const arrayAccessBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 20,
		caption: "随机访问：nums = [1, 3, 2, 5, 4]，这次要访问下标 3",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(ARRAY_ACCESS, "const i = Math.floor")],
		caption: "第一步：算出要访问的下标 i = 3，蓝色指针快速定位",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(ARRAY_ACCESS, "const random_num = nums[i]")],
		caption: "内存地址 = 首地址 + 元素大小 × 索引，一次乘加算出地址",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 30,
		caption: "nums[i] 一跳到位：指针直接落到 index = 3",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 38,
		caption: "取到 nums[3] = 5，中间的元素一个都没有遍历",
	},
	{
		phase: "caption",
		durationInFrames: 34,
		caption: "地址可以直接计算 → 任意下标的访问都是 O(1)",
	},
];

const AccessViz: React.FC = () => {
	const t = useScene();

	// 蓝色指针：16 帧内从 0 快速定位到 index = 3
	const sweep = between(t.frame, t.startOf(1), t.startOf(1) + 16);
	const pointerX = INDEX * CELL * sweep + CELL / 2;
	const pointerLabel = `i = ${Math.min(INDEX, Math.round(sweep * INDEX))}`;
	const pointerOpacity = between(t.frame, t.startOf(1), t.startOf(1) + 6);

	// 地址公式卡片随第二行高亮出现
	const formulaP =
		t.beatIndex >= 2 ? between(t.frame, t.startOf(2), t.startOf(2) + 16) : 0;

	// 一跳到位：目标格橙色脉冲（30 帧内完成）
	const jumpF = t.since(3);
	const pulse = interpolate(
		jumpF,
		[0, 10, 18, 26, 30],
		[1, 1.18, 1, 1.1, 1.06],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const cells: ArrayCell[] = VALUES.map((value, slot) => ({
		key: `${slot}:${value}`,
		value,
		tone: slot === INDEX && t.beatIndex >= 3 ? "focus" : "default",
		scale: slot === INDEX ? pulse : 1,
		note: slot === INDEX && t.beatIndex >= 4 ? "nums[3] = 5" : undefined,
	}));

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
				gap: 130,
			}}
		>
			<div style={{ position: "relative", width: N * CELL, height: 200 }}>
				<ArrayBlocks cells={cells} slots={N} />
				<PointerArrow
					x={pointerX}
					y={CELL + 64}
					label={pointerLabel}
					color={colors.blue}
					opacity={pointerOpacity}
					direction="up"
				/>
			</div>
			<div
				style={{
					opacity: formulaP,
					transform: `translateY(${(1 - formulaP) * 24}px)`,
				}}
			>
				<MemoryAddressFormula index={INDEX} />
			</div>
		</div>
	);
};

export const ArrayAccess: React.FC = () => (
	<SceneShell
		beats={arrayAccessBeats}
		title="访问元素"
		section="4.1 数组"
		badge={{ label: "O(1)", tone: "green" }}
		code={ARRAY_ACCESS}
		codeTitle="array.ts"
	>
		<AccessViz />
	</SceneShell>
);
