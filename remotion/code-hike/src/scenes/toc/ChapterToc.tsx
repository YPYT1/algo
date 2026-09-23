import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
  Beat,
  between,
  useScene,
} from "../../motion/useSceneProgress";
import { colors, fontSizes, toneStyles, uiFont } from "../../design/tokens";

export const chapterTocBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 30,
    caption: "第 4 章 · 数组与链表：先看两种数据结构的「存储方式」",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 78,
    caption: "数组是连续的砖块，链表是分散的砖块 + 指针藤蔓",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 168,
    caption: "本章目录：4.1 数组 → 4.2 链表 → 4.3 列表",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 60,
    caption: "重点：增、删、改、查四类操作在两种结构上的差异",
  },
  {
    phase: "caption",
    durationInFrames: 60,
    caption: "接下来按目录逐节演示增删改查",
  },
];

type TocRow = {
  branch: string;
  label: string;
  depth: 0 | 1 | 2;
  chips?: string[];
  muted?: boolean;
  /** 本章重点小节（emphasize 阶段橙色高亮） */
  keySection?: boolean;
};

const ROWS: TocRow[] = [
  { branch: "", label: "第 4 章 数组与链表", depth: 0 },
  { branch: "├── ", label: "4.1 数组", depth: 1, keySection: true },
  {
    branch: "│   ├── ",
    label: "",
    depth: 2,
    chips: ["初始化", "访问", "插入", "删除", "遍历", "查找", "扩容"],
  },
  { branch: "│   ├── ", label: "优点与局限", depth: 2 },
  { branch: "│   └── ", label: "典型应用", depth: 2 },
  { branch: "├── ", label: "4.2 链表", depth: 1, keySection: true },
  {
    branch: "│   ├── ",
    label: "",
    depth: 2,
    chips: ["初始化", "插入", "删除", "访问", "查找"],
  },
  { branch: "│   ├── ", label: "数组 vs 链表", depth: 2 },
  { branch: "│   ├── ", label: "常见链表类型", depth: 2 },
  { branch: "│   └── ", label: "典型应用", depth: 2 },
  { branch: "├── ", label: "4.3 列表", depth: 1, keySection: true },
  { branch: "│   ├── ", label: "列表操作", depth: 2 },
  { branch: "│   └── ", label: "列表实现 MyList", depth: 2 },
  { branch: "├── ", label: "4.4 内存与缓存", depth: 1, muted: true },
  { branch: "├── ", label: "4.5 小结", depth: 1, muted: true },
  { branch: "└── ", label: "4.6 练习", depth: 1, muted: true },
];

/** 书中隐喻：整齐砖块（数组） vs 分散砖块 + 橙色藤蔓（链表） */
const BrickMetaphor: React.FC<{ readonly appear: number }> = ({ appear }) => {
  const arrayCell = 64;
  const linked = [
    { x: 30, y: 40 },
    { x: 175, y: 130 },
    { x: 300, y: 30 },
    { x: 430, y: 140 },
    { x: 560, y: 55 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34, fontFamily: uiFont }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: colors.orange,
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 700, color: colors.ink }}>
            数组：连续存储的砖块
          </span>
        </div>
        <div style={{ display: "flex" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = between(appear, i * 4, i * 4 + 16);
            return (
              <div
                key={i}
                style={{
                  width: arrayCell,
                  height: arrayCell,
                  marginRight: i === 4 ? 0 : -3,
                  background: toneStyles.focus.bg,
                  border: `3px solid ${colors.orange}`,
                  borderRadius: 8,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                }}
              />
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: fontSizes.note, color: colors.muted }}>
          地址连续 → 一次算出任意元素位置
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: colors.purple,
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 700, color: colors.ink }}>
            链表：分散存储 + 指针藤蔓
          </span>
        </div>
        <svg width={660} height={200} style={{ overflow: "visible" }}>
          {linked.slice(0, -1).map((from, i) => {
            const to = linked[i + 1];
            const p = between(appear, 34 + i * 7, 34 + i * 7 + 18);
            return (
              <path
                key={`v-${i}`}
                d={`M ${from.x + 56} ${from.y + 28} Q ${(from.x + to.x) / 2 + 40} ${
                  (from.y + to.y) / 2 - 46
                } ${to.x} ${to.y + 28}`}
                fill="none"
                stroke={colors.orange}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
            );
          })}
          {linked.map((pos, i) => {
            const p = between(appear, 30 + i * 6, 30 + i * 6 + 16);
            return (
              <g key={`b-${i}`} opacity={p}>
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={56}
                  height={56}
                  rx={8}
                  fill={toneStyles.compare.bg}
                  stroke={colors.purple}
                  strokeWidth={3}
                />
              </g>
            );
          })}
        </svg>
        <div style={{ marginTop: 6, fontSize: fontSizes.note, color: colors.muted }}>
          地址分散 → 访问要顺着指针一步步走
        </div>
      </div>
    </div>
  );
};

const TocTree: React.FC = () => {
  const timeline = useScene();
  const emphasize = timeline.progressOf(3);
  const rowHeight = 46;

  return (
    <div
      style={{
        flex: 1,
        background: colors.surface,
        border: `2px solid ${colors.border}`,
        borderRadius: 20,
        padding: "26px 34px",
        fontFamily: uiFont,
        boxShadow: "0 10px 0 0 rgba(255,106,0,0.06)",
      }}
    >
      {ROWS.map((row, i) => {
        const start = timeline.startOf(2) + i * 9;
        const p = between(timeline.frame, start, start + 18);
        const isRoot = row.depth === 0;
        const litKey =
          row.keySection !== undefined &&
          row.keySection &&
          emphasize > 0;
        const current = i === Math.min(
          ROWS.length - 1,
          Math.floor(
            Math.max(0, timeline.frame - timeline.startOf(2)) / 9,
          ),
        );

        return (
          <div
            key={`${row.branch}${row.label}${i}`}
            style={{
              height: rowHeight,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: p,
              transform: `translateX(${(1 - p) * -18}px)`,
              background:
                isRoot || litKey || current
                  ? "rgba(255,106,0,0.10)"
                  : "transparent",
              borderRadius: 10,
              paddingLeft: isRoot || litKey ? 12 : 4,
              borderLeft: isRoot
                ? `6px solid ${colors.orange}`
                : litKey
                  ? `6px solid ${colors.orange}`
                  : "6px solid transparent",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Consolas, monospace",
                fontSize: 26,
                color: colors.muted,
                whiteSpace: "pre",
              }}
            >
              {row.branch}
            </span>
            {row.label ? (
              <span
                style={{
                  fontSize: isRoot ? 38 : row.depth === 1 ? 30 : 27,
                  fontWeight: isRoot || row.depth === 1 ? 700 : 400,
                  color: isRoot
                    ? colors.orange
                    : row.muted
                      ? colors.muted
                      : colors.ink,
                }}
              >
                {row.label}
              </span>
            ) : null}
            {row.chips ? (
              <div style={{ display: "flex", gap: 10, marginLeft: 8 }}>
                {row.chips.map((chip, j) => {
                  const cp = between(
                    timeline.frame,
                    start + 10 + j * 5,
                    start + 10 + j * 5 + 14,
                  );
                  return (
                    <span
                      key={chip}
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: colors.blue,
                        background: colors.blueTint,
                        border: `2px solid ${colors.blue}`,
                        borderRadius: 999,
                        padding: "3px 14px",
                        opacity: cp,
                        transform: `translateY(${(1 - cp) * 10}px)`,
                      }}
                    >
                      {chip}
                    </span>
                  );
                })}
              </div>
            ) : null}
            {row.muted ? (
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.muted,
                  background: "#F1F1F1",
                  borderRadius: 6,
                  padding: "2px 10px",
                  marginLeft: 8,
                }}
              >
                二期
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const TocBody: React.FC = () => {
  const timeline = useScene();
  const metaphor = Math.max(0, timeline.frame - timeline.startOf(1));

  return (
    <div style={{ display: "flex", gap: 52, width: "100%", alignItems: "stretch" }}>
      <div
        style={{
          width: 660,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <BrickMetaphor appear={metaphor} />
      </div>
      <TocTree />
    </div>
  );
};

export const ChapterToc: React.FC = () => {
  return (
    <SceneShell
      beats={chapterTocBeats}
      title="第 4 章 · 数组与链表"
      section="目录"
      variant="full"
    >
      <TocBody />
    </SceneShell>
  );
};
