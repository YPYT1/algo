import React, { useMemo } from "react";
import { interpolate } from "remotion";
import { colors } from "../../design/tokens";

/** 场景内分镜进度点：已走过的实心橙、当前放大、未到的浅色 */
export const ProgressDots: React.FC<{
  readonly count: number;
  readonly active: number;
}> = ({ count, active }) => {
  const dots = useMemo(
    () => new Array(Math.max(0, count)).fill(0).map((_, i) => i),
    [count],
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {dots.map((i) => {
        const isActive = i <= active;
        const current = i === active;
        const size = interpolate(current ? 1 : 0, [0, 1], [10, 16]);
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: 999,
              background: isActive ? colors.orange : "#E7E7E7",
              opacity: isActive ? 1 : 0.9,
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
};
