import React from "react";
import { colors, fontSizes, toneStyles, uiFont, codeFont } from "../../design/tokens";

/**
 * 地址公式卡片：内存地址 = 首地址 + 元素大小 × 索引（书中图 4-2）。
 * 索引用橙色（当前操作），计算结果用蓝色（地址）。
 */
export const MemoryAddressFormula: React.FC<{
  readonly base?: number;
  readonly elementSize?: number;
  readonly index: number;
}> = ({ base = 16, elementSize = 4, index }) => {
  const computed = base + elementSize * index;
  const hex = `0x${computed.toString(16).toUpperCase().padStart(2, "0")}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        fontFamily: uiFont,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 34,
          fontWeight: 700,
          color: colors.ink,
          background: colors.surface,
          border: `3px solid ${toneStyles.focus.border}`,
          borderRadius: 16,
          padding: "18px 30px",
          boxShadow: "0 8px 0 0 rgba(255,106,0,0.12)",
        }}
      >
        <span style={{ color: colors.muted, fontSize: 26 }}>内存地址 =</span>
        <span style={{ fontFamily: codeFont, color: colors.blue }}>
          首地址(0x{base.toString(16).toUpperCase().padStart(2, "0")})
        </span>
        <span style={{ color: colors.muted }}>+</span>
        <span style={{ fontFamily: codeFont, color: colors.purple }}>{elementSize} ×</span>
        <span
          style={{
            fontFamily: codeFont,
            color: colors.orange,
            background: colors.orangeTint,
            borderRadius: 8,
            padding: "2px 14px",
          }}
        >
          {index}
        </span>
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          fontFamily: codeFont,
          color: colors.blue,
          background: colors.blueTint,
          borderRadius: 12,
          padding: "10px 26px",
        }}
      >
        = {hex}
      </div>
      <div style={{ fontSize: fontSizes.note, color: colors.muted }}>
        元素大小固定 → 一次乘加即可算出地址（常数时间）
      </div>
    </div>
  );
};
