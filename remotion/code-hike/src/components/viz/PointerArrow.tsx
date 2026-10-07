import type React from "react";
import { colors } from "../../design/tokens";

/**
 * 指针箭头：指向数组某个格子（默认从格子下方朝上指）。
 * x / y 为相对父容器左上角的坐标（x 会被居中）。
 */
export const PointerArrow: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly color?: string;
	readonly label?: string;
	readonly sublabel?: string;
	readonly opacity?: number;
	readonly direction?: "up" | "down";
	readonly stem?: number;
	readonly reverse?: boolean;
}> = ({
	x,
	y,
	color = colors.orange,
	label,
	sublabel,
	opacity = 1,
	direction = "up",
	stem = 34,
	reverse = false,
}) => {
	const pointingUp = direction === "up";
	// 指针本体（杆 + 三角头），label 统一排在箭头外侧
	const body = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				order: pointingUp ? 0 : 1,
			}}
		>
			<svg
				width={30}
				height={22}
				viewBox="0 0 30 22"
				style={{ overflow: "visible" }}
			>
				<title>{`${label ?? "指针"}：${pointingUp ? "向上" : "向下"}箭头`}</title>
				<polygon
					points={pointingUp ? "15,0 2,20 28,20" : "15,22 2,2 28,2"}
					fill={color}
				/>
			</svg>
			<div
				style={{
					width: 4,
					height: stem,
					background: color,
					borderRadius: 2,
				}}
			/>
		</div>
	);

	const text =
		label || sublabel ? (
			<div
				style={{
					order: pointingUp ? 1 : 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 4,
				}}
			>
				{label ? (
					<div
						style={{
							fontSize: 24,
							fontWeight: 700,
							color,
							background: colors.bg,
							border: `2px solid ${color}`,
							borderRadius: 8,
							padding: "2px 12px",
							whiteSpace: "nowrap",
							fontFamily: "Consolas, monospace",
						}}
					>
						{label}
					</div>
				) : null}
				{sublabel ? (
					<div
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: colors.muted,
							whiteSpace: "nowrap",
						}}
					>
						{sublabel}
					</div>
				) : null}
			</div>
		) : null;

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				transform: "translateX(-50%)",
				opacity,
				zIndex: 5,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				pointerEvents: "none",
				filter: reverse ? "none" : undefined,
			}}
		>
			{pointingUp ? (
				<>
					{body}
					{text}
				</>
			) : (
				<>
					{text}
					{body}
				</>
			)}
		</div>
	);
};
