import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Beat } from "../motion/useSceneProgress";
import { hashCaption } from "./hash";
import manifest from "../../public/narration/manifest.json";

type Manifest = {
  files: Record<string, string>;
};

const data = manifest as Manifest;

const resolveSrc = (caption: string): string | null => {
  const key = caption.trim().replace(/\s+/g, " ");
  const rel = data.files[key] ?? data.files[hashCaption(key)];
  if (!rel) return null;
  return staticFile(rel.startsWith("narration/") ? rel : `narration/${rel}`);
};

/**
 * 按 Beat 时间轴叠放旁白音频：
 * 只在「本 Beat 显式声明了 caption」且已预生成 wav 时开播。
 */
export const NarrationAudio: React.FC<{ beats: Beat[]; starts: number[] }> = ({
  beats,
  starts,
}) => {
  const clips = useMemo(() => {
    const list: Array<{ from: number; duration: number; src: string; key: string }> =
      [];
    for (let i = 0; i < beats.length; i++) {
      const caption = beats[i]?.caption;
      if (!caption) continue;
      const src = resolveSrc(caption);
      if (!src) continue;
      list.push({
        from: starts[i] ?? 0,
        duration: beats[i]!.durationInFrames,
        src,
        key: `${i}-${hashCaption(caption)}`,
      });
    }
    return list;
  }, [beats, starts]);

  if (clips.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {clips.map((clip) => (
        <Sequence
          key={clip.key}
          from={clip.from}
          durationInFrames={Math.max(1, clip.duration)}
          layout="none"
        >
          <Audio src={clip.src} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
