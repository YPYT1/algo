import type React from "react";
import { useMemo } from "react";
import { colors, fontSizes, type Tone, toneStyles } from "../../design/tokens";

/** 节点尺寸：左格 val、右格 next（对应书中图 4-5） */
export const NODE_W = 156;
export const NODE_H = 104;
const VAL_W = 96;

export type LLNode = {
	id: string;
	/** 节点名，如 n0、P */
	name?: string;
	val: number;
	/** 舞台坐标（左上角） */
	x: number;
	y: number;
	tone?: Tone;
	opacity?: number;
	scale?: number;
	/** 节点下方注释 */
	note?: string;
	/** next 格内文字（默认为空，箭头自行绘制） */
	nextText?: string;
};

export type LLEdge = {
	id: string;
	from: string;
	/** 目标节点 id；null 表示空指针 */
	to: string | null;
	tone?: Tone;
	opacity?: number;
	dashed?: boolean;
	/** 曲率：>0 向上拱，<0 向下（避免多条箭头重叠） */
	bend?: number;
	/** 线上方的小标注，如 "n0.next = P" */
	label?: string;
};

export type Stage = { width: number; height: number };

const edgeColor = (tone: Tone = "default"): string => {
	if (tone === "default") return colors.ink;
	return toneStyles[tone].border;
};

/**
 * 链表舞台：分散节点（HTML 盒子）+ 箭头（SVG 路径）。
 * 箭头从节点的 next 格出发，指向目标节点左侧，可带曲率与标注。
 */
export const LinkedListNodes: React.FC<{
	readonly nodes: LLNode[];
	readonly edges?: LLEdge[];
	readonly stage?: Stage;
	readonly scale?: number;
	readonly showNullStub?: boolean;
}> = ({
	nodes,
	edges = [],
	stage = { width: 940, height: 560 },
	scale = 1,
	showNullStub = true,
}) => {
	const byId = useMemo(() => {
		const map = new Map<string, LLNode>();
		nodes.forEach((node) => {
			map.set(node.id, node);
		});
		return map;
	}, [nodes]);

	return (
		<div
			style={{
				position: "relative",
				width: stage.width,
				height: stage.height,
				transform: `scale(${scale})`,
				transformOrigin: "center center",
			}}
		>
			<svg
				width={stage.width}
				height={stage.height}
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					overflow: "visible",
					zIndex: 1,
				}}
			>
				<title>链表节点之间的指针连接</title>
				{edges.map((edge) => {
					const from = byId.get(edge.from);
					if (!from) return null;
					const color = edgeColor(edge.tone);
					const opacity = edge.opacity ?? 1;
					const startX = from.x + NODE_W;
					const startY = from.y + NODE_H / 2;

					if (edge.to === null) {
						if (!showNullStub) return null;
						return (
							<g key={edge.id} opacity={opacity}>
								<line
									x1={startX}
									y1={startY}
									x2={startX + 46}
									y2={startY}
									stroke={color}
									strokeWidth={4}
									strokeDasharray={edge.dashed ? "10 8" : undefined}
								/>
								<line
									x1={startX + 40}
									y1={startY - 16}
									x2={startX + 64}
									y2={startY + 16}
									stroke={color}
									strokeWidth={4}
									strokeLinecap="round"
								/>
							</g>
						);
					}

					const to = byId.get(edge.to);
					if (!to) return null;
					const endX = to.x;
					const endY = to.y + NODE_H / 2;
					const bend = edge.bend ?? 0;
					const ctrlX = (startX + endX) / 2;
					const ctrlY = (startY + endY) / 2 + bend;

					// 末端切线方向（二次贝塞尔：P2 - C）
					const dirX = endX - ctrlX;
					const dirY = endY - ctrlY;
					const len = Math.hypot(dirX, dirY) || 1;
					const ux = dirX / len;
					const uy = dirY / len;
					const headLen = 18;
					const headHalf = 9;
					const tailX = endX - ux * headLen;
					const tailY = endY - uy * headLen;
					const px = -uy;
					const py = ux;
					const head = `${endX},${endY} ${tailX + px * headHalf},${tailY + py * headHalf} ${tailX - px * headHalf},${tailY - py * headHalf}`;
					const labelX = (startX + endX) / 2;
					const labelY = (startY + endY) / 2 + (bend >= 0 ? -26 : 30);

					return (
						<g key={edge.id} opacity={opacity}>
							<path
								d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${tailX} ${tailY}`}
								fill="none"
								stroke={color}
								strokeWidth={5}
								strokeLinecap="round"
								strokeDasharray={edge.dashed ? "12 10" : undefined}
							/>
							<polygon points={head} fill={color} />
							{edge.label ? (
								<text
									x={labelX}
									y={labelY}
									textAnchor="middle"
									fill={color}
									fontSize={24}
									fontWeight={700}
									fontFamily="Consolas, monospace"
								>
									{edge.label}
								</text>
							) : null}
						</g>
					);
				})}
			</svg>

			{nodes.map((node) => {
				const skin = toneStyles[node.tone ?? "default"];
				return (
					<div
						key={node.id}
						style={{
							position: "absolute",
							left: node.x,
							top: node.y,
							width: NODE_W,
							zIndex: 2,
							opacity: node.opacity ?? 1,
							transform: `scale(${node.scale ?? 1})`,
							transformOrigin: "center center",
						}}
					>
						{node.name ? (
							<div
								style={{
									position: "absolute",
									top: -34,
									left: 0,
									fontSize: 24,
									fontWeight: 700,
									color: colors.blue,
									fontFamily: "Consolas, monospace",
								}}
							>
								{node.name}
							</div>
						) : null}
						<div
							style={{
								display: "flex",
								height: NODE_H,
								borderRadius: 12,
								overflow: "hidden",
								border: `3px solid ${skin.border}`,
								background: skin.bg,
								boxShadow: `0 6px 0 0 ${skin.border}22`,
							}}
						>
							<div
								style={{
									width: VAL_W,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: fontSizes.node,
									fontWeight: 700,
									color: skin.fg,
									fontFamily: "Consolas, monospace",
									borderRight: `3px solid ${skin.border}`,
								}}
							>
								{node.val}
							</div>
							<div
								style={{
									flex: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 20,
									fontWeight: 700,
									color: skin.fg,
									fontFamily: "Consolas, monospace",
									gap: 4,
								}}
							>
								{node.nextText ?? ""}
							</div>
						</div>
						{node.note ? (
							<div
								style={{
									marginTop: 8,
									fontSize: fontSizes.note,
									fontWeight: 700,
									color:
										skin.fg === toneStyles.default.fg ? colors.muted : skin.fg,
									textAlign: "center",
									whiteSpace: "nowrap",
								}}
							>
								{node.note}
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};
