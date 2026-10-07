import type React from "react";
import { colors, layout } from "../../design/tokens";

/** 右侧 / 区域 数据结构动画容器 */
export const VizPanel: React.FC<{
	readonly children: React.ReactNode;
	readonly divided?: boolean;
}> = ({ children, divided = true }) => {
	return (
		<div
			style={{
				flex: 1,
				minWidth: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				padding: layout.vizPad,
				borderLeft: divided ? `1px solid ${colors.hairline}` : undefined,
				overflow: "hidden",
			}}
		>
			{children}
		</div>
	);
};
