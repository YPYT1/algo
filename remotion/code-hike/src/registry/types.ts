import type React from "react";
import type { Beat } from "../motion/useSceneProgress";

/** 场景分区（与第 4 章目录对应） */
export type SceneSection = "toc" | "array" | "linked-list" | "list" | "extra";

/**
 * 场景元数据注册表条目。
 * 扩展约定：新增动画 = 在 registry/chapter4.ts 加一条 SceneDefinition
 *          + 实现对应 scenes/** 组件 + 放 snippet；
 *          Root.tsx 用 registry.map 批量 <Composition />。
 */
export type SceneDefinition = {
  /** Composition id（同时是 Studio 中的场景名） */
  id: string;
  /** 中文标题 */
  title: string;
  section: SceneSection;
  /** 由场景自身的 beats 推导，保证代码/动画时间轴与合成时长一致 */
  durationInFrames: number;
  component: React.ComponentType;
  /** 分镜节拍（旁白 TTS / 时间轴同步） */
  beats: Beat[];
  /** 代码片段来源（相对 src），便于回溯 */
  snippetPath?: string;
  /** 分阶段旁白（简体中文） */
  captions: string[];
  /** false = 占位（stub），不进入 Chapter4Full */
  enabled: boolean;
};
