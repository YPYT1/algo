import type React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fontSizes, layout, uiFont } from "../../design/tokens";
import {
	type Beat,
	SceneContext,
	useSceneTimeline,
} from "../../motion/useSceneProgress";
import { NarrationAudio } from "../../narration/NarrationAudio";
import { CaptionBar } from "./CaptionBar";
import { CodePanel } from "./CodePanel";
import { ProgressDots } from "./ProgressDots";
import { VizPanel } from "./VizPanel";

export type BadgeTone = "green" | "orange" | "blue" | "purple";

const badgeStyle: Record<BadgeTone, { background: string; color: string }> = {
	green: { background: colors.green, color: "#FFFFFF" },
	orange: { background: colors.orange, color: "#FFFFFF" },
	blue: { background: colors.blue, color: "#FFFFFF" },
	purple: { background: colors.purple, color: "#FFFFFF" },
};

export type SceneShellProps = {
	beats: Beat[];
	title: string;
	section: string;
	badge?: { label: string; tone?: BadgeTone };
	variant?: "split" | "full";
	code?: string;
	codeTitle?: string;
	children: React.ReactNode;
};

/**
 * 场景外壳：白底 + 标题条 + 分栏 + 底部中文旁白 + 同步有声讲解。
 */
export const SceneShell: React.FC<SceneShellProps> = ({
	beats,
	title,
	section,
	badge,
	variant = "split",
	code,
	codeTitle,
	children,
}) => {
	const timeline = useSceneTimeline(beats);
	const badgeTone = badge?.tone ?? "orange";
	const badgeSkin = badgeStyle[badgeTone];

	return (
		<SceneContext.Provider value={timeline}>
			<AbsoluteFill
				style={{
					background: colors.bg,
					color: colors.ink,
					fontFamily: uiFont,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<NarrationAudio beats={beats} starts={timeline.starts} />

				<div
					style={{
						height: layout.headerH,
						flexShrink: 0,
						display: "flex",
						alignItems: "center",
						gap: 22,
						padding: `0 ${layout.pad}px`,
						borderBottom: `1px solid ${colors.hairline}`,
					}}
				>
					<span
						style={{
							fontSize: fontSizes.sectionChip,
							fontWeight: 700,
							color: colors.orange,
							background: colors.orangeTint,
							border: `2px solid ${colors.orange}`,
							borderRadius: 999,
							padding: "5px 16px",
							whiteSpace: "nowrap",
						}}
					>
						{section}
					</span>
					<span
						style={{
							fontSize: fontSizes.header,
							fontWeight: 700,
							letterSpacing: 1,
						}}
					>
						{title}
					</span>
					<div
						style={{
							marginLeft: "auto",
							display: "flex",
							alignItems: "center",
							gap: 26,
						}}
					>
						<ProgressDots count={beats.length} active={timeline.beatIndex} />
						{badge ? (
							<span
								style={{
									fontSize: fontSizes.badge,
									fontWeight: 700,
									fontFamily: uiFont,
									color: badgeSkin.color,
									background: badgeSkin.background,
									borderRadius: 10,
									padding: "6px 18px",
									minWidth: 96,
									textAlign: "center",
								}}
							>
								{badge.label}
							</span>
						) : null}
					</div>
				</div>

				{variant === "split" ? (
					<div style={{ flex: 1, display: "flex", minHeight: 0 }}>
						{code ? <CodePanel code={code} title={codeTitle} /> : null}
						<VizPanel>{children}</VizPanel>
					</div>
				) : (
					<div
						style={{
							flex: 1,
							minHeight: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: `24px ${layout.pad}px`,
						}}
					>
						{children}
					</div>
				)}

				<CaptionBar />
			</AbsoluteFill>
		</SceneContext.Provider>
	);
};
