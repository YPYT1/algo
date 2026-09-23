import React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import { CapacityBar } from "../../components/viz/CapacityBar";
import { Beat, between, useScene } from "../../motion/useSceneProgress";
import { colors, toneStyles } from "../../design/tokens";
import { MYLIST_MODEL } from "../../snippets/list";
import { lineOf } from "../../snippets/lineOf";

/** 内容块宽度：与 CapacityBar 的 860 对齐 */
const BLOCK_W = 860;
const CARD_W = 276;
/**
 * 10 个空槽的容器：宽度 = 860 × (10 / 20)，
 * 与容量条（max = 20）的 capacity 段严格对齐。
 */
const SLOT_W = 43;
const SLOT_H = 58;

const FIELD_CARDS = [
  { value: "_capacity = 10", note: "容量：底层数组能装多少", skin: toneStyles.info },
  { value: "_size = 0", note: "长度：当前元素个数", skin: toneStyles.focus },
  { value: "extendRatio = 2", note: "扩容倍数：每次扩容 ×2", skin: toneStyles.fresh },
];

const ADD_VALUES = [1, 3, 2, 5, 4];

export const myListModelBeats: Beat[] = [
  {
    phase: "idle",
    durationInFrames: 20,
    caption: "MyList 三要素：容量、长度、扩容倍数",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 26,
    codeLines: [
      lineOf(MYLIST_MODEL, "_capacity: number = 10"),
      lineOf(MYLIST_MODEL, "_size: number = 0"),
      lineOf(MYLIST_MODEL, "extendRatio: number = 2"),
    ],
    caption: "① 三个字段：_capacity 容量、_size 长度、extendRatio 扩容倍数",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 60,
    caption: "三张字段卡片依次弹出：容量 10、长度 0、扩容倍数 2",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 36,
    caption: "初始状态：_capacity = 10，_size = 0，extendRatio = 2",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 28,
    codeLines: [
      lineOf(MYLIST_MODEL, "constructor()"),
      lineOf(MYLIST_MODEL, "this.arr = new Array(this._capacity)"),
    ],
    caption: "② 构造方法：new Array(_capacity) 一次性开出容量 10 的底层数组",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 54,
    caption: "虚线蓝框容量条出现：10 个空槽，size = 0，capacity = 10",
  },
  {
    phase: "highlight-code-line",
    durationInFrames: 30,
    codeLines: [lineOf(MYLIST_MODEL, "return this._size")],
    caption: "③ 驱动代码连续 add 5 次：1, 3, 2, 5, 4，每次 _size 自增",
  },
  {
    phase: "mutate-viz",
    durationInFrames: 78,
    caption: "5 个元素逐个落进空槽，橙色 size 从 0 涨到 5，capacity 恒为 10",
  },
  {
    phase: "emphasize-result",
    durationInFrames: 40,
    caption: "定格：size = 5 / capacity = 10，还剩 5 个空槽",
  },
  {
    phase: "caption",
    durationInFrames: 40,
    caption: "底层是数组，容量固定 10，装满才扩容",
  },
];

const ModelViz: React.FC = () => {
  const t = useScene();

  const barIn = between(t.frame, t.startOf(5) + 4, t.startOf(5) + 30);
  const elements = ADD_VALUES.map((value, i) => ({
    value,
    index: i,
    p: between(t.frame, t.startOf(7) + i * 13, t.startOf(7) + i * 13 + 20),
  }));
  /** 已落位的元素个数 = 容量条上的 size */
  const landed = elements.filter((el) => el.p >= 1).length;

  return (
    <div
      style={{
        width: BLOCK_W,
        display: "flex",
        flexDirection: "column",
        gap: 34,
      }}
    >
      {/* 三张字段卡片（对应三个字段行的高亮） */}
      <div style={{ display: "flex", gap: 16 }}>
        {FIELD_CARDS.map((card, i) => {
          const p = between(
            t.frame,
            t.startOf(2) + i * 12,
            t.startOf(2) + i * 12 + 24,
          );
          return (
            <div
              key={card.value}
              style={{
                width: CARD_W,
                boxSizing: "border-box",
                padding: "16px 18px",
                borderRadius: 14,
                background: "#FFFFFF",
                border: `3px solid ${card.skin.border}`,
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`,
                boxShadow:
                  p >= 1 ? `0 6px 0 0 ${card.skin.border}22` : undefined,
              }}
            >
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  fontFamily: "Consolas, monospace",
                  color: card.skin.fg,
                  whiteSpace: "nowrap",
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: colors.muted,
                  marginTop: 10,
                }}
              >
                {card.note}
              </div>
            </div>
          );
        })}
      </div>

      {/* 构造出的底层数组 + size / capacity 双刻度条 */}
      <div
        style={{
          opacity: barIn,
          transform: `translateY(${(1 - barIn) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 26,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: colors.blue,
                marginBottom: 10,
              }}
            >
              底层数组 arr：10 个空槽（capacity = 10）
            </div>
            <div
              style={{
                position: "relative",
                width: SLOT_W * 10,
                height: SLOT_H,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={`slot-${i}`}
                  style={{
                    position: "absolute",
                    left: i * SLOT_W,
                    top: 0,
                    width: SLOT_W,
                    height: SLOT_H,
                    boxSizing: "border-box",
                    border: `2px dashed ${colors.blue}`,
                    borderRadius: 8,
                    background: "#FFFFFF",
                  }}
                />
              ))}
              {elements.map((el) =>
                el.p <= 0 ? null : (
                  <div
                    key={`el-${el.index}`}
                    style={{
                      position: "absolute",
                      left: el.index * SLOT_W + 3,
                      top: 3,
                      width: SLOT_W - 6,
                      height: SLOT_H - 6,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: toneStyles.fresh.bg,
                      border: `3px solid ${toneStyles.fresh.border}`,
                      color: toneStyles.fresh.fg,
                      borderRadius: 6,
                      fontSize: 24,
                      fontWeight: 700,
                      fontFamily: "Consolas, monospace",
                      opacity: el.p,
                      transform: `translateY(${(1 - el.p) * -34}px) scale(${
                        0.7 + 0.3 * el.p
                      })`,
                      zIndex: 2,
                    }}
                  >
                    {el.value}
                  </div>
                ),
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.muted,
              lineHeight: 1.5,
              paddingBottom: 4,
            }}
          >
            虚线 = 空槽
            <br />
            橙条 = size，蓝框 = capacity
          </div>
        </div>

        <CapacityBar size={landed} capacity={10} max={20} />
      </div>
    </div>
  );
};

export const MyListModel: React.FC = () => (
  <SceneShell
    beats={myListModelBeats}
    title="MyList 三要素"
    section="4.3 列表"
    badge={{ label: "模型", tone: "purple" }}
    code={MYLIST_MODEL}
    codeTitle="my_list.ts"
  >
    <ModelViz />
  </SceneShell>
);
