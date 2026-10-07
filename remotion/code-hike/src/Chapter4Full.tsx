import type React from "react";
import { Series } from "remotion";
import { enabledScenes } from "./registry/chapter4";

/**
 * 总片：按注册表顺序串联所有 enabled 场景（stub 自动跳过）。
 * 每个场景仍可作为独立 Composition 单独预览 / 单独渲染。
 */
export const Chapter4Full: React.FC = () => (
	<Series>
		{enabledScenes.map((scene) => (
			<Series.Sequence
				key={scene.id}
				name={scene.id}
				durationInFrames={scene.durationInFrames}
			>
				<scene.component />
			</Series.Sequence>
		))}
	</Series>
);
