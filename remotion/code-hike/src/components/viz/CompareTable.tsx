import type React from "react";
import { colors, toneStyles, uiFont } from "../../design/tokens";

export type CompareRow = {
	label: string;
	array: string;
	linkedList: string;
	/** 该行讲解时的强调对象 */
	winner?: "array" | "linked" | "none";
};

/**
 * 数组 vs 链表对比表（书中表 4-1）。
 * highlight = 当前正在讲解的行（0-based），该行整行橙色高亮。
 */
export const CompareTable: React.FC<{
	readonly rows: CompareRow[];
	readonly highlight?: number;
	readonly title?: string;
}> = ({ rows, highlight = -1, title }) => {
	const colW = 300;
	const labelW = 210;

	const cellStyle = (
		active: boolean,
		skin: { bg: string; border: string; fg: string },
	): React.CSSProperties => ({
		padding: "16px 20px",
		fontSize: 26,
		fontWeight: 700,
		textAlign: "center",
		color: active ? skin.fg : colors.ink,
		background: active ? skin.bg : colors.surface,
		border: `2px solid ${active ? skin.border : colors.hairline}`,
		fontFamily: uiFont,
	});

	return (
		<div style={{ fontFamily: uiFont, width: labelW + colW * 2 }}>
			{title ? (
				<div
					style={{
						fontSize: 28,
						fontWeight: 700,
						color: colors.ink,
						marginBottom: 16,
						textAlign: "center",
					}}
				>
					{title}
				</div>
			) : null}
			<div style={{ display: "flex" }}>
				<div
					style={{
						width: labelW,
						padding: "16px 20px",
						fontSize: 24,
						fontWeight: 700,
						color: colors.muted,
						background: colors.bgSoft,
						border: `2px solid ${colors.hairline}`,
					}}
				/>
				<div
					style={{
						width: colW,
						textAlign: "center",
						padding: "16px 20px",
						fontSize: 28,
						fontWeight: 700,
						color: "#FFFFFF",
						background: colors.blue,
						border: `2px solid ${colors.blue}`,
					}}
				>
					数组
				</div>
				<div
					style={{
						width: colW,
						textAlign: "center",
						padding: "16px 20px",
						fontSize: 28,
						fontWeight: 700,
						color: "#FFFFFF",
						background: colors.purple,
						border: `2px solid ${colors.purple}`,
					}}
				>
					链表
				</div>
			</div>

			{rows.map((row, i) => {
				const active = i === highlight;
				const arrayWin = active && row.winner === "array";
				const linkedWin = active && row.winner === "linked";
				return (
					<div key={row.label} style={{ display: "flex" }}>
						<div
							style={{
								width: labelW,
								padding: "16px 20px",
								fontSize: 24,
								fontWeight: 700,
								color: active ? colors.orange : colors.muted,
								background: active ? colors.orangeTint : colors.bgSoft,
								border: `2px solid ${active ? toneStyles.focus.border : colors.hairline}`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{row.label}
						</div>
						<div
							style={{
								width: colW,
								...cellStyle(
									active,
									arrayWin ? toneStyles.fresh : toneStyles.info,
								),
							}}
						>
							{row.array}
						</div>
						<div
							style={{
								width: colW,
								...cellStyle(
									active,
									linkedWin ? toneStyles.fresh : toneStyles.compare,
								),
							}}
						>
							{row.linkedList}
						</div>
					</div>
				);
			})}
		</div>
	);
};
