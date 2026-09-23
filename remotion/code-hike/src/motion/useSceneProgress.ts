import { createContext, useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE_TEACH } from "../design/tokens";

/**
 * 「代码 ↔ 动画」同步协议（强制）：
 * 每个场景由一串 Beat 驱动，Beat 同时声明
 *   - phase：当前阶段
 *   - codeLines：左侧需要橙色高亮的代码行（1-based）
 *   - caption：底部中文旁白
 * 规则：先高亮代码行，再播结构动画，最后结果定格 + 一句总结。
 */
export type ScenePhase =
  | "idle"
  | "highlight-code-line"
  | "mutate-viz"
  | "emphasize-result"
  | "caption";

export type Beat = {
  phase: ScenePhase;
  durationInFrames: number;
  /** 底部中文旁白（沿用最近一条已声明的） */
  caption?: string;
  /** 左侧代码高亮行（1-based，沿用最近一条已声明的） */
  codeLines?: number[];
};

export type SceneTimeline = {
  frame: number;
  beats: Beat[];
  starts: number[];
  total: number;
  beatIndex: number;
  beat: Beat;
  /** 当前 Beat 内部进度 0..1 */
  beatProgress: number;
  phase: ScenePhase;
  /** 整场进度 0..1 */
  progress: number;
  /** 当前生效的高亮代码行 */
  activeLines: number[];
  /** 高亮行距今多少帧（用于高亮入场动画） */
  linesAge: number;
  /** 当前生效的旁白 */
  caption: string;
  /** 旁白距今多少帧 */
  captionAge: number;
  /** 第 i 个 Beat 的起始帧 */
  startOf: (i: number) => number;
  /** 距第 i 个 Beat 开始过了多少帧（截断到该 Beat 时长） */
  since: (i: number) => number;
  /** 第 i 个 Beat 的进度 0..1 */
  progressOf: (i: number) => number;
};

export const SceneContext = createContext<SceneTimeline | null>(null);

export const useScene = (): SceneTimeline => {
  const value = useContext(SceneContext);
  if (!value) {
    throw new Error("useScene 必须在 SceneShell 内部使用");
  }
  return value;
};

/** 所有 Beat 的总帧数（= 单场景 Composition 时长） */
export const totalFrames = (beats: Beat[]): number =>
  beats.reduce((sum, beat) => sum + beat.durationInFrames, 0);

/** 通用分段进度：把「frame - start」映射为 0..1，自动 clamp */
export const seg = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE_TEACH,
): number =>
  interpolate(frame - start, [0, Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** 两帧之间的线性推进（clamp） */
export const between = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = EASE_TEACH,
): number =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const useSceneTimeline = (beats: Beat[]): SceneTimeline => {
  const frame = useCurrentFrame();

  const starts: number[] = [0];
  for (let i = 0; i < beats.length; i++) {
    starts.push(starts[i] + beats[i].durationInFrames);
  }
  const total = starts[starts.length - 1];

  let beatIndex = 0;
  for (let i = 0; i < beats.length; i++) {
    if (frame >= starts[i]) {
      beatIndex = i;
    }
  }
  const beat = beats[beatIndex];
  const beatProgress = interpolate(
    frame,
    [starts[beatIndex], starts[beatIndex] + beat.durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 旁白 / 高亮行都「沿用最近一次声明」
  let caption = "";
  let captionBeat = -1;
  let activeLines: number[] = [];
  let linesBeat = -1;
  for (let i = beatIndex; i >= 0; i--) {
    if (captionBeat === -1 && beats[i].caption !== undefined) {
      caption = beats[i].caption as string;
      captionBeat = i;
    }
    if (linesBeat === -1 && beats[i].codeLines !== undefined) {
      activeLines = beats[i].codeLines as number[];
      linesBeat = i;
    }
    if (captionBeat !== -1 && linesBeat !== -1) {
      break;
    }
  }

  const value: SceneTimeline = {
    frame,
    beats,
    starts,
    total,
    beatIndex,
    beat,
    beatProgress,
    phase: beat.phase,
    progress: total === 0 ? 0 : Math.min(1, frame / total),
    activeLines,
    linesAge: linesBeat === -1 ? Number.POSITIVE_INFINITY : frame - starts[linesBeat],
    caption,
    captionAge: captionBeat === -1 ? Number.POSITIVE_INFINITY : frame - starts[captionBeat],
    startOf: (i: number) => starts[Math.max(0, Math.min(starts.length - 1, i))],
    since: (i: number) => {
      const start = starts[Math.max(0, Math.min(starts.length - 1, i))];
      const duration = beats[Math.max(0, Math.min(beats.length - 1, i))].durationInFrames;
      return Math.max(0, Math.min(duration, frame - start));
    },
    progressOf: (i: number) => {
      const index = Math.max(0, Math.min(beats.length - 1, i));
      return interpolate(
        frame,
        [starts[index], starts[index] + beats[index].durationInFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
    },
  };

  return value;
};
