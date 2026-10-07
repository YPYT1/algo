/**
 * 旁白文件名：同一句中文永远映射到同一个 wav。
 * 浏览器 / Node 都能用（不依赖 Buffer）。
 */
export const hashCaption = (text: string): string => {
	const normalized = text.trim().replace(/\s+/g, " ");
	let h = 2166136261;
	for (let i = 0; i < normalized.length; i++) {
		h ^= normalized.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
};

export const narrationPathFor = (caption: string): string =>
	`narration/${hashCaption(caption)}.wav`;

/** 教师音色说明（Breeze Voice Design） */
export const TEACHER_VOICE_INSTRUCTION =
	"一位耐心清晰的算法课教师，男声，语速适中偏慢，吐字清楚，像在课堂上给学生讲解数据结构，语气亲切专业，略带鼓励。";

export type NarrationManifest = {
	/** caption 原文 → 相对 public 的 wav 路径 */
	files: Record<string, string>;
	sampleRate: number;
	voiceInstruction: string;
	generatedAt?: string;
};
