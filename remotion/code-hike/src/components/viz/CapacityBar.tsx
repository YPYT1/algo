import type React from "react";
import { colors, fontSizes, toneStyles, uiFont } from "../../design/tokens";

/**
 * 容量条：长度 size（橙）与容量 capacity（蓝刻度）双标尺，
 * 用于 MyList 扩容场景（size == capacity 触发 capacity × 2）。
 */
export const CapacityBar: React.FC<{
	readonly size: number;
	readonly capacity: number;
	readonly max?: number;
	readonly sizeLabel?: string;
	readonly capacityLabel?: string;
	readonly note?: string;
	/** capacity 段的强调色（触发扩容时用绿色） */
	readonly capacityTone?: "info" | "fresh" | "focus";
}> = ({
	size,
	capacity,
	max,
	sizeLabel = "长度 size",
	capacityLabel = "容量 capacity",
	note,
	capacityTone = "info",
}) => {
	const limit = Math.max(max ?? Math.max(size, capacity, 1), size, capacity, 1);
	const capSkin = toneStyles[capacityTone];
	const pct = (v: number) => `${Math.min(100, (v / limit) * 100)}%`;

	return (
		<div
			style={{
				width: 860,
				fontFamily: uiFont,
				display: "flex",
				flexDirection: "column",
				gap: 20,
			}}
		>
			<div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: 8,
					}}
				>
					<span
						style={{
							fontSize: 24,
							fontWeight: 700,
							color: toneStyles.focus.fg,
						}}
					>
						{sizeLabel}
					</span>
					<span
						style={{
							fontSize: 26,
							fontWeight: 700,
							fontFamily: "Consolas, monospace",
							color: toneStyles.focus.fg,
						}}
					>
						{size}
					</span>
				</div>
				<div
					style={{
						height: 44,
						borderRadius: 10,
						background: "#F4F4F4",
						border: `2px solid #E3E3E3`,
						overflow: "hidden",
						position: "relative",
					}}
				>
					<div
						style={{
							width: pct(size),
							height: "100%",
							background: toneStyles.focus.border,
						}}
					/>
				</div>
			</div>

			<div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: 8,
					}}
				>
					<span style={{ fontSize: 24, fontWeight: 700, color: capSkin.fg }}>
						{capacityLabel}
					</span>
					<span
						style={{
							fontSize: 26,
							fontWeight: 700,
							fontFamily: "Consolas, monospace",
							color: capSkin.fg,
						}}
					>
						{capacity}
					</span>
				</div>
				<div
					style={{
						height: 44,
						borderRadius: 10,
						background: "#F4F4F4",
						border: `2px dashed ${capSkin.border}`,
						overflow: "hidden",
						position: "relative",
					}}
				>
					<div
						style={{
							width: pct(capacity),
							height: "100%",
							background: capSkin.bg,
							borderRight: `4px solid ${capSkin.border}`,
						}}
					/>
				</div>
			</div>

			{/* 刻度 */}
			<div style={{ display: "flex", gap: 0, marginTop: -8 }}>
				{Array.from({ length: limit }, (_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: 刻度的位置就是其身份，只会在末尾增加或减少。
						key={i}
						style={{
							width: `${100 / limit}%`,
							textAlign: "center",
							fontSize: fontSizes.small,
							color: i < size ? colors.orange : colors.muted,
							fontWeight: 700,
						}}
					>
						{i}
					</div>
				))}
			</div>

			{note ? (
				<div
					style={{
						fontSize: 24,
						fontWeight: 700,
						color: colors.ink,
						background: colors.bgSoft,
						border: `2px solid ${colors.border}`,
						borderRadius: 10,
						padding: "10px 18px",
						alignSelf: "flex-start",
					}}
				>
					{note}
				</div>
			) : null}
		</div>
	);
};
