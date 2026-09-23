import { Easing } from "remotion";
import { fontFamily } from "../font";

/**
 * 第 4 章视觉设计系统（强制规范）：
 * - 白底为主（60–70% 留白），色块只用于节点 / 箭头 / 徽章 / 进度
 * - 第一强调色：高饱和橙（当前操作、焦点、目录激活项）
 * - 第二强调色：高饱和红（删除、危险、即将消失）
 * - 其余辅助色（蓝 / 绿 / 紫 / 黄）同样保持高饱和
 * - 禁止：暗黑整屏、紫色渐变、低饱和莫兰迪、玻璃态大阴影
 */
export const colors = {
  /** 主背景 */
  bg: "#FFFFFF",
  /** 极浅暖白（备用背景） */
  bgSoft: "#FFFCFA",
  /** 卡片 / 节点底板 */
  surface: "#FFFFFF",
  /** 细描边 */
  border: "#FFE8D6",

  /** 第一强调色：当前操作 / 焦点 */
  orange: "#FF6A00",
  orangeAlt: "#FF7A00",
  orangeTint: "#FFF1E6",

  /** 第二强调色：删除 / 危险 */
  red: "#FF2D2D",
  redAlt: "#E10600",
  redTint: "#FFECEC",

  /** 辅助：索引 / 指针 / 地址 */
  blue: "#0066FF",
  blueTint: "#EAF2FF",

  /** 辅助：成功 / 插入完成 / 新节点落地 */
  green: "#00C853",
  greenDeep: "#00A844",
  greenTint: "#E8FBF0",

  /** 辅助：对比高亮 / 次要标签 */
  purple: "#A100FF",
  purpleTint: "#F6ECFF",

  /** 辅助：临时值 / 缓存行提示 */
  yellow: "#FFD600",
  yellowDeep: "#8A6D00",
  yellowTint: "#FFF8DB",

  /** 主文字 */
  ink: "#0A0A0A",
  /** 次要文字 */
  muted: "#5C5C5C",
  /** 极细分隔线 */
  hairline: "#EDE7E1",
} as const;

/** 元素状态配色（色块必须高饱和，仅文字可降饱和） */
export type Tone =
  | "default"
  | "focus"
  | "danger"
  | "fresh"
  | "info"
  | "compare"
  | "cache"
  | "muted";

export const toneStyles: Record<Tone, { bg: string; border: string; fg: string }> = {
  default: { bg: "#FFFFFF", border: "#111111", fg: "#0A0A0A" },
  focus: { bg: "#FFF1E6", border: "#FF6A00", fg: "#FF6A00" },
  danger: { bg: "#FFECEC", border: "#FF2D2D", fg: "#E10600" },
  fresh: { bg: "#E8FBF0", border: "#00C853", fg: "#00A844" },
  info: { bg: "#EAF2FF", border: "#0066FF", fg: "#0066FF" },
  compare: { bg: "#F6ECFF", border: "#A100FF", fg: "#A100FF" },
  cache: { bg: "#FFF8DB", border: "#FFD600", fg: "#8A6D00" },
  muted: { bg: "#FFFFFF", border: "#BDBDBD", fg: "#9A9A9A" },
};

/** 中文 UI 字体：优先系统中文字体，避免依赖网络字体 */
export const uiFont = `"Microsoft YaHei", "PingFang SC", "Noto Sans SC", "Source Han Sans SC", system-ui, sans-serif`;

/** 代码字体：保留模板的 Roboto Mono，中文回退到系统字体 */
export const codeFont = `${fontFamily}, "Consolas", "Microsoft YaHei", monospace`;

/** 合成分辨率与帧率 */
export const canvas = { width: 1920, height: 1080, fps: 30 } as const;

/** 布局刻度 */
export const layout = {
  headerH: 92,
  captionH: 118,
  progressH: 6,
  /** 左右安全边距 */
  pad: 48,
  /** 代码面板占比（推荐 45%~50%） */
  codeRatio: 0.47,
  /** 代码面板横向内边距 */
  codePad: 30,
  vizPad: 40,
};

/** 字号刻度 */
export const fontSizes = {
  header: 36,
  sectionChip: 20,
  caption: 30,
  badge: 24,
  cell: 46,
  index: 24,
  note: 22,
  node: 34,
  small: 20,
};

/**
 * 教学动效：慢一点、停顿清楚；
 * 关键操作 1.5–3s，操作结束有 0.4–0.8s 定格。
 */
export const EASE_TEACH = Easing.bezier(0.22, 0.61, 0.36, 1);
/** 结果落地 / 入场的轻微回弹 */
export const EASE_SNAP = Easing.bezier(0.34, 1.28, 0.64, 1);
