import type React from "react";
import { useMemo } from "react";
import { colors, fontSizes, type Tone, toneStyles } from "../../design/tokens";

/** 数组格子尺寸（108×108，5 格约 540px，8 格约 864px，均在右侧动画区内） */
export const CELL = 112;
export const CELL_RADIUS = 14;

export type ArrayCell = {
	key: string;
	value: number | null;
	/** 水平位移，单位 = 格（支持小数，用于平滑搬移） */
	dx?: number;
	/** 垂直位移 px */
	dy?: number;
	opacity?: number;
	tone?: Tone;
	scale?: number;
	dashed?: boolean;
	/** 格子下方的小字标注，如「被挤掉」「新元素」 */
	note?: string;
};

/**
 * 连续方块 + 下标：白色留白为主，色块只用于状态强调。
 * cells 为「实际元素」（会移动），背景另有静止的槽位虚线框。
 */
export const ArrayBlocks: React.FC<{
	readonly cells: ArrayCell[];
	/** 槽位数量，默认与 cells 相同 */
	readonly slots?: number;
	readonly showIndex?: boolean;
	readonly indexFrom?: number;
	readonly cellSize?: number;
}> = ({ cells, slots, showIndex = true, indexFrom = 0, cellSize = CELL }) => {
	const slotCount = slots ?? cells.length;
	const slotIndexes = useMemo(
		() =>
			new Array(Math.max(0, slotCount)).fill(0).map((_, i) => i + indexFrom),
		[slotCount, indexFrom],
	);

	return (
		<div
			style={{
				position: "relative",
				width: slotCount * cellSize,
				height: cellSize + 64,
			}}
		>
			{/* 静止槽位（虚线）：元素搬移时能看清「格子在哪」 */}
			{slotIndexes.map((index) => (
				<div
					key={`slot-${index}`}
					style={{
						position: "absolute",
						left: (index - indexFrom) * cellSize + 4,
						top: 4,
						width: cellSize - 8,
						height: cellSize - 8,
						boxSizing: "border-box",
						border: `2px dashed #E3E3E3`,
						borderRadius: CELL_RADIUS,
						background: "#FCFCFC",
					}}
				/>
			))}

			{/* 元素方块 */}
			{cells.map((cell) => {
				const skin = toneStyles[cell.tone ?? "default"];
				const dx = cell.dx ?? 0;
				const dy = cell.dy ?? 0;
				const scale = cell.scale ?? 1;
				return (
					<div
						key={cell.key}
						style={{
							position: "absolute",
							left: cellSlot(cell) * cellSize + 4,
							top: 4 + dy,
							width: cellSize - 8,
							height: cellSize - 8,
							boxSizing: "border-box",
							transform: `translateX(${dx * cellSize}px) scale(${scale})`,
							transformOrigin: "center center",
							opacity: cell.opacity ?? 1,
							background: skin.bg,
							border: `${cell.dashed ? "3px dashed" : "3px solid"} ${skin.border}`,
							borderRadius: CELL_RADIUS,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: skin.fg,
							fontSize: fontSizes.cell,
							fontWeight: 700,
							fontFamily: "Consolas, monospace",
							zIndex: 2,
							boxShadow:
								cell.tone && cell.tone !== "default" && cell.tone !== "muted"
									? `0 6px 0 0 ${skin.border}22`
									: undefined,
						}}
					>
						{cell.value ?? "—"}
					</div>
				);
			})}

			{/* 下标 */}
			{showIndex
				? slotIndexes.map((index) => (
						<div
							key={`idx-${index}`}
							style={{
								position: "absolute",
								left: (index - indexFrom) * cellSize,
								top: cellSize + 8,
								width: cellSize,
								textAlign: "center",
								fontSize: fontSizes.index,
								fontWeight: 700,
								color: colors.blue,
								fontFamily: "Consolas, monospace",
							}}
						>
							{index}
						</div>
					))
				: null}

			{/* 格子下方小字标注 */}
			{cells.map((cell) =>
				cell.note ? (
					<div
						key={`note-${cell.key}`}
						style={{
							position: "absolute",
							left: (cellSlot(cell) + (cell.dx ?? 0)) * cellSize,
							top: cellSize + 40,
							width: cellSize,
							textAlign: "center",
							fontSize: fontSizes.note,
							fontWeight: 700,
							color: toneStyles[cell.tone ?? "default"].fg,
							whiteSpace: "nowrap",
							zIndex: 3,
						}}
					>
						{cell.note}
					</div>
				) : null,
			)}
		</div>
	);
};

/** cell 的静态槽位下标（由 key 前缀 `i:` 携带，避免依赖数组顺序） */
function cellSlot(cell: ArrayCell): number {
	const parsed = Number.parseInt(cell.key.split(":")[0], 10);
	return Number.isNaN(parsed) ? 0 : parsed;
}
