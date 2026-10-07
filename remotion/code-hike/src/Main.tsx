import type { HighlightedCode } from "codehike/code";
import { useMemo } from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { CodeTransition } from "./CodeTransition";
import { type ThemeColors, ThemeProvider } from "./calculate-metadata/theme";
import { verticalPadding } from "./font";
import { ProgressBar } from "./ProgressBar";
import { RefreshOnCodeChange } from "./ReloadOnCodeChange";

export type Props = {
	steps: HighlightedCode[] | null;
	themeColors: ThemeColors | null;
	codeWidth: number | null;
};

export const Main: React.FC<Props> = ({ steps, themeColors, codeWidth }) => {
	if (!steps) {
		throw new Error("Steps are not defined");
	}

	const { durationInFrames } = useVideoConfig();
	const stepDuration = durationInFrames / steps.length;
	const transitionDuration = 30;

	if (!themeColors) {
		throw new Error("Theme colors are not defined");
	}

	const outerStyle: React.CSSProperties = useMemo(() => {
		return {
			backgroundColor: themeColors.background,
		};
	}, [themeColors]);

	const style: React.CSSProperties = useMemo(() => {
		return {
			padding: `${verticalPadding}px 0px`,
		};
	}, []);

	return (
		<ThemeProvider themeColors={themeColors}>
			<AbsoluteFill style={outerStyle}>
				<AbsoluteFill
					style={{
						width: codeWidth || "100%",
						margin: "auto",
					}}
				>
					<ProgressBar steps={steps} />
					<AbsoluteFill style={style}>
						<Series>
							{steps.map((step, index) => (
								<Series.Sequence
									// biome-ignore lint/suspicious/noArrayIndexKey: 每个片段对应固定的时间轴位置，按该位置保持动画组件身份。
									key={index}
									layout="none"
									durationInFrames={stepDuration}
									name={step.meta}
								>
									<CodeTransition
										oldCode={steps[index - 1]}
										newCode={step}
										durationInFrames={transitionDuration}
									/>
								</Series.Sequence>
							))}
						</Series>
					</AbsoluteFill>
				</AbsoluteFill>
			</AbsoluteFill>
			<RefreshOnCodeChange />
		</ThemeProvider>
	);
};
