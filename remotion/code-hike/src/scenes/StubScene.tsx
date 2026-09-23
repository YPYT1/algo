import React from "react";

/** 第二期占位场景（注册表 enabled: false 时不会进入总片） */
export const createStub = (label: string): React.ComponentType => {
  const StubScene: React.FC = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        background: "#FFFFFF",
        color: "#5C5C5C",
        fontSize: 44,
        fontWeight: 700,
        fontFamily: '"Microsoft YaHei", sans-serif',
      }}
    >
      <div style={{ color: "#FF6A00", fontSize: 56 }}>{label}</div>
      <div style={{ fontSize: 28 }}>本节为占位场景（enabled: false）</div>
    </div>
  );
  return StubScene;
};
