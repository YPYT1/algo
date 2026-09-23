import React from "react";
import { interpolate } from "remotion";
import { colors, fontSizes, layout, uiFont } from "../../design/tokens";
import { useScene } from "../../motion/useSceneProgress";

/** 底部中文讲解一句：换句时淡入 + 轻微上移 */
export const CaptionBar: React.FC = () => {
  const timeline = useScene();

  const opacity = interpolate(timeline.captionAge, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(timeline.captionAge, [0, 12], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        height: layout.captionH,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: `0 ${layout.pad}px`,
        borderTop: `1px solid ${colors.hairline}`,
        background: colors.bgSoft,
        fontFamily: uiFont,
      }}
    >
      <div
        style={{
          fontSize: fontSizes.sectionChip,
          fontWeight: 700,
          color: colors.bg,
          background: colors.orange,
          borderRadius: 8,
          padding: "6px 14px",
          letterSpacing: 2,
          flexShrink: 0,
        }}
      >
        旁白
      </div>
      <div
        style={{
          fontSize: fontSizes.caption,
          fontWeight: 700,
          color: colors.ink,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {timeline.caption || "…"}
      </div>
    </div>
  );
};
