import type React from "react";
import { Composition } from "remotion";
import { Chapter4Full } from "./Chapter4Full";
import { canvas } from "./design/tokens";
import { chapter4FullDuration, chapter4Scenes } from "./registry/chapter4";

/**
 * 场景注册表 → Composition 批量注册。
 * 新增小节只需在 registry/chapter4.ts 加一条，不必改这里。
 */
export const RemotionRoot: React.FC = () => {
	return (
		<>
			{chapter4Scenes.map((scene) => (
				<Composition
					key={scene.id}
					id={scene.id}
					component={scene.component}
					durationInFrames={scene.durationInFrames}
					fps={canvas.fps}
					width={canvas.width}
					height={canvas.height}
					defaultProps={{}}
				/>
			))}
			<Composition
				id="第4章完整版"
				component={Chapter4Full}
				durationInFrames={chapter4FullDuration}
				fps={canvas.fps}
				width={canvas.width}
				height={canvas.height}
				defaultProps={{}}
			/>
		</>
	);
};
