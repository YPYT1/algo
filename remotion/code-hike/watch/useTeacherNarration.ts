import type { PlayerRef } from "@remotion/player";
import type React from "react";
import { useEffect, useRef } from "react";
import manifest from "../public/narration/manifest.json";
import { type Beat, totalFrames } from "../src/motion/useSceneProgress";
import {
	hashCaption,
	narrationPathFor,
	TEACHER_VOICE_INSTRUCTION,
} from "../src/narration/hash";

const TTS_URL =
	(import.meta as { env?: { VITE_BREEZE_TTS_URL?: string } }).env
		?.VITE_BREEZE_TTS_URL ?? "http://127.0.0.1:7860/v1/audio/speech";

type CaptionHit = { text: string; from: number };

const captionAtFrame = (beats: Beat[], frame: number): CaptionHit | null => {
	let start = 0;
	let active: CaptionHit | null = null;
	for (const beat of beats) {
		const end = start + beat.durationInFrames;
		if (beat.caption !== undefined) {
			active = { text: beat.caption.trim().replace(/\s+/g, " "), from: start };
		}
		if (frame >= start && frame < end) {
			return active;
		}
		start = end;
	}
	return active;
};

const pcm16ToAudioBuffer = async (
	pcm: ArrayBuffer,
	ctx: AudioContext,
	sampleRate = 24000,
): Promise<AudioBuffer> => {
	const view = new DataView(pcm);
	const samples = pcm.byteLength / 2;
	const buffer = ctx.createBuffer(1, samples, sampleRate);
	const channel = buffer.getChannelData(0);
	for (let i = 0; i < samples; i++) {
		channel[i] = view.getInt16(i * 2, true) / 32768;
	}
	return buffer;
};

const playWavUrl = async (url: string) => {
	const audio = new Audio(url);
	audio.preload = "auto";
	try {
		await audio.play();
	} catch {
		// 用户未交互时浏览器可能拦截，忽略
	}
	return () => {
		audio.pause();
		audio.src = "";
	};
};

const playPcm = async (pcm: ArrayBuffer, ctx: AudioContext) => {
	const buffer = await pcm16ToAudioBuffer(pcm, ctx);
	const src = ctx.createBufferSource();
	src.buffer = buffer;
	src.connect(ctx.destination);
	src.start();
	return () => {
		try {
			src.stop();
		} catch {
			/* already stopped */
		}
	};
};

const speakBrowser = (text: string) => {
	if (!("speechSynthesis" in window)) return () => undefined;
	window.speechSynthesis.cancel();
	const u = new SpeechSynthesisUtterance(text);
	u.lang = "zh-CN";
	u.rate = 0.92;
	// 尽量挑中文男声
	const voices = window.speechSynthesis.getVoices();
	const zh =
		voices.find(
			(v) =>
				/zh(-|_)?CN/i.test(v.lang) &&
				/male|男|Yunxi|Yunyang|Kangkang/i.test(v.name),
		) ?? voices.find((v) => /zh/i.test(v.lang));
	if (zh) u.voice = zh;
	window.speechSynthesis.speak(u);
	return () => window.speechSynthesis.cancel();
};

const fetchBreeze = async (text: string): Promise<ArrayBuffer | null> => {
	try {
		const form = new FormData();
		form.append("text", text);
		form.append("instruction", TEACHER_VOICE_INSTRUCTION);
		form.append("cfg_scale", "4");
		form.append("seed", "42");
		const res = await fetch(TTS_URL, { method: "POST", body: form });
		if (!res.ok) return null;
		return await res.arrayBuffer();
	} catch {
		return null;
	}
};

/**
 * 跟随 Player 当前帧，在旁白切换时朗读：
 * 1) 本地预生成 wav（public/narration）
 * 2) 本机 Breeze TTS API
 * 3) 浏览器 SpeechSynthesis 兜底
 */
export const useTeacherNarration = (
	playerRef: React.RefObject<PlayerRef | null>,
	beats: Beat[],
	enabled: boolean,
) => {
	const lastText = useRef<string>("");
	const stopRef = useRef<(() => void) | null>(null);
	const audioCtx = useRef<AudioContext | null>(null);

	useEffect(() => {
		if (!enabled) {
			stopRef.current?.();
			stopRef.current = null;
			lastText.current = "";
			return;
		}

		let alive = true;
		const tick = async () => {
			const player = playerRef.current;
			if (!player || !alive) return;
			const frame = player.getCurrentFrame();
			const hit = captionAtFrame(beats, frame);
			const text = hit?.text ?? "";
			if (!text || text === lastText.current) return;
			lastText.current = text;

			stopRef.current?.();
			stopRef.current = null;

			// 1) 预生成文件
			const key = text;
			const rel =
				(manifest as { files?: Record<string, string> }).files?.[key] ??
				(manifest as { files?: Record<string, string> }).files?.[
					hashCaption(key)
				];
			if (rel) {
				stopRef.current = await playWavUrl(`/${rel}`);
				return;
			}
			// 也试默认命名
			const guess = narrationPathFor(text);
			try {
				const head = await fetch(`/${guess}`, { method: "HEAD" });
				if (head.ok) {
					stopRef.current = await playWavUrl(`/${guess}`);
					return;
				}
			} catch {
				/* continue */
			}

			// 2) Breeze API
			const pcm = await fetchBreeze(text);
			if (pcm && alive) {
				audioCtx.current ??= new AudioContext({ sampleRate: 24000 });
				if (audioCtx.current.state === "suspended") {
					await audioCtx.current.resume();
				}
				stopRef.current = await playPcm(pcm, audioCtx.current);
				return;
			}

			// 3) 浏览器兜底
			if (alive) {
				stopRef.current = speakBrowser(text);
			}
		};

		const id = window.setInterval(() => {
			void tick();
		}, 120);

		// 预热中文 voice 列表
		if ("speechSynthesis" in window) {
			window.speechSynthesis.getVoices();
			window.speechSynthesis.onvoiceschanged = () => {
				window.speechSynthesis.getVoices();
			};
		}

		return () => {
			alive = false;
			window.clearInterval(id);
			stopRef.current?.();
			stopRef.current = null;
		};
	}, [playerRef, beats, enabled]);
};

export const sceneDuration = (beats: Beat[]) => totalFrames(beats);
