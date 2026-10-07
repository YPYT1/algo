import { Player, type PlayerRef } from "@remotion/player";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { canvas } from "../src/design/tokens";
import { chapter4Scenes, enabledScenes } from "../src/registry/chapter4";
import { useTeacherNarration } from "./useTeacherNarration";

/**
 * 纯观看页：左侧中文目录 + Player + 教师有声旁白。
 * 旁白优先级：预生成 wav → 本机 Breeze TTS → 浏览器语音。
 */
export const WatchApp: React.FC = () => {
	const scenes = useMemo(
		() => (enabledScenes.length > 0 ? enabledScenes : chapter4Scenes),
		[],
	);
	const [activeId, setActiveId] = useState(scenes[0]?.id ?? "");
	const [voiceOn, setVoiceOn] = useState(true);
	const playerRef = useRef<PlayerRef>(null);
	const scene = scenes.find((item) => item.id === activeId) ?? scenes[0];

	useTeacherNarration(playerRef, scene?.beats ?? [], voiceOn && Boolean(scene));

	const sections = useMemo(() => {
		const map = new Map<string, typeof scenes>();
		for (const item of scenes) {
			const list = map.get(item.section) ?? [];
			list.push(item);
			map.set(item.section, list);
		}
		return map;
	}, [scenes]);

	if (!scene) {
		return <div style={{ color: "#fff", padding: 40 }}>没有可播放的场景</div>;
	}

	const sectionTitle: Record<string, string> = {
		toc: "目录",
		array: "4.1 数组",
		"linked-list": "4.2 链表",
		list: "4.3 列表",
		extra: "其他",
	};

	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				color: "#f5f5f5",
				background: "#111",
			}}
		>
			<aside
				style={{
					width: 280,
					flexShrink: 0,
					borderRight: "1px solid #2a2a2a",
					overflow: "auto",
					padding: "16px 12px",
					background: "#161616",
				}}
			>
				<div
					style={{
						fontSize: 18,
						fontWeight: 700,
						marginBottom: 8,
						padding: "0 8px",
					}}
				>
					第 4 章 · 纯观看
				</div>
				<div
					style={{
						fontSize: 12,
						color: "#999",
						marginBottom: 12,
						padding: "0 8px",
						lineHeight: 1.5,
					}}
				>
					旁白会像老师一样跟画面同步讲解。
					<br />
					优先 Breeze-TTS-2，否则用浏览器语音。
				</div>

				<label
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "8px 10px",
						marginBottom: 14,
						background: "#222",
						borderRadius: 8,
						cursor: "pointer",
						fontSize: 13,
					}}
				>
					<input
						type="checkbox"
						checked={voiceOn}
						onChange={(e) => setVoiceOn(e.target.checked)}
					/>
					开启教师旁白
				</label>

				{[...sections.entries()].map(([section, list]) => (
					<div key={section} style={{ marginBottom: 14 }}>
						<div
							style={{
								fontSize: 12,
								fontWeight: 700,
								color: "#FF6A00",
								padding: "6px 8px",
								letterSpacing: 1,
							}}
						>
							{sectionTitle[section] ?? section}
						</div>
						{list.map((item) => {
							const active = item.id === scene.id;
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveId(item.id)}
									style={{
										display: "block",
										width: "100%",
										textAlign: "left",
										border: "none",
										borderRadius: 8,
										padding: "10px 12px",
										marginBottom: 4,
										cursor: "pointer",
										background: active ? "#FF6A00" : "transparent",
										color: active ? "#fff" : "#ddd",
										fontWeight: active ? 700 : 500,
										fontSize: 14,
									}}
								>
									{item.id}
								</button>
							);
						})}
					</div>
				))}
			</aside>

			<main
				style={{
					flex: 1,
					minWidth: 0,
					display: "flex",
					flexDirection: "column",
					padding: 20,
					gap: 12,
				}}
			>
				<div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
					<h1 style={{ margin: 0, fontSize: 22 }}>{scene.id}</h1>
					<span style={{ color: "#999", fontSize: 14 }}>{scene.title}</span>
				</div>

				<div
					style={{
						flex: 1,
						minHeight: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: "#000",
						borderRadius: 12,
						overflow: "hidden",
					}}
				>
					<Player
						ref={playerRef}
						key={scene.id}
						component={scene.component}
						durationInFrames={scene.durationInFrames}
						compositionWidth={canvas.width}
						compositionHeight={canvas.height}
						fps={canvas.fps}
						controls
						loop
						autoPlay
						clickToPlay
						doubleClickToFullscreen
						style={{
							width: "100%",
							maxHeight: "100%",
							aspectRatio: `${canvas.width} / ${canvas.height}`,
						}}
					/>
				</div>
			</main>
		</div>
	);
};
