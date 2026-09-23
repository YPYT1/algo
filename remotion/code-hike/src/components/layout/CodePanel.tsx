import { measureText } from "@remotion/layout-utils";
import { AnnotationHandler, HighlightedCode, Pre, highlight } from "codehike/code";
import React, { useEffect, useMemo, useState } from "react";
import { interpolate, useDelayRender } from "remotion";
import { codeFont, colors, uiFont } from "../../design/tokens";
import { useScene } from "../../motion/useSceneProgress";

/** 代码面板尺寸（与 SceneShell 的 47% / 53% 分栏对应） */
const PANEL_WIDTH = Math.round(1920 * 0.47);
const PANEL_PAD = 30;
const BASE_FONT_SIZE = 26;
const LINE_HEIGHT = 1.72;
const HIGHLIGHT_THEME = "github-light";

/**
 * 行级橙色高亮（左竖条 + 淡橙底）。
 * 高亮由 line div 自身完成，因此随行入场动画可直接作用其上。
 */
const focusHandler: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  AnnotatedLine: (props) => {
    const { children } = props;
    const timeline = useScene();
    const reveal = interpolate(timeline.linesAge, [0, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <div
        style={{
          background: `rgba(255, 106, 0, ${0.13 * reveal})`,
          boxShadow: `inset ${6 * reveal}px 0 0 0 ${colors.orange}`,
          opacity: 1,
        }}
      >
        {children}
      </div>
    );
  },
};

const fitFontSize = (code: string): number => {
  const longest = code.split("\n").reduce((a, b) => (b.length > a.length ? b : a), "");
  const usable = PANEL_WIDTH - PANEL_PAD * 2;
  try {
    const at100 = measureText({
      text: longest,
      fontFamily: codeFont,
      fontSize: 100,
      validateFontIsLoaded: false,
    }).width;
    if (!at100 || !Number.isFinite(at100)) {
      return 18;
    }
    const target = (usable * 100) / at100;
    return Math.max(14, Math.min(BASE_FONT_SIZE, target));
  } catch {
    return 18;
  }
};

/** 左侧代码面板：Code Hike 高亮（github-light） + 按 Beat 高亮关键行 */
export const CodePanel: React.FC<{
  readonly code: string;
  readonly title?: string;
}> = ({ code, title }) => {
  const timeline = useScene();
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("code-panel-highlight"));

  useEffect(() => {
    let alive = true;
    highlight({ value: code, lang: "ts", meta: "" }, HIGHLIGHT_THEME)
      .then((result) => {
        if (!alive) {
          return;
        }
        setHighlighted(result);
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
    return () => {
      alive = false;
    };
  }, [code, continueRender, handle]);

  const fontSize = useMemo(() => fitFontSize(code), [code]);

  const withFocus: HighlightedCode | null = useMemo(() => {
    if (!highlighted || timeline.activeLines.length === 0) {
      return highlighted;
    }
    const lines = timeline.activeLines.filter(
      (line) => line >= 1 && line <= highlighted.value.split("\n").length,
    );
    if (lines.length === 0) {
      return highlighted;
    }
    return {
      ...highlighted,
      annotations: [
        ...highlighted.annotations.filter((a) => a.name !== "focus"),
        ...lines.map((line) => ({
          name: "focus",
          query: "",
          fromLineNumber: line,
          toLineNumber: line,
        })),
      ],
    };
  }, [highlighted, timeline.activeLines]);

  const style: React.CSSProperties = useMemo(
    () => ({
      ...(highlighted?.style ?? {}),
      whiteSpace: "pre",
      fontFamily: codeFont,
      fontSize,
      lineHeight: LINE_HEIGHT,
      tabSize: 2,
      margin: 0,
      background: "transparent",
      color: colors.ink,
    }),
    [highlighted, fontSize],
  );

  return (
    <div
      style={{
        width: `${Math.round(0.47 * 100)}%`,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: colors.surface,
        fontFamily: uiFont,
      }}
    >
      <div
        style={{
          height: 54,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${PANEL_PAD}px`,
          borderBottom: `1px solid ${colors.hairline}`,
        }}
      >
        <span
          style={{
            fontSize: 21,
            fontWeight: 700,
            color: colors.muted,
            fontFamily: codeFont,
          }}
        >
          {title ?? "snippet.ts"}
        </span>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: colors.blue,
            background: colors.blueTint,
            borderRadius: 6,
            padding: "3px 10px",
            letterSpacing: 1,
          }}
        >
          TypeScript
        </span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: `${28}px ${PANEL_PAD}px`,
        }}
      >
        {withFocus ? (
          <Pre code={withFocus} handlers={[focusHandler]} style={style} />
        ) : (
          <div style={{ fontSize: 21, color: colors.muted, fontFamily: codeFont }}>
            {"// loading…"}
          </div>
        )}
      </div>
    </div>
  );
};
