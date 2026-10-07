import React from "react";
import { createRoot } from "react-dom/client";
import { WatchApp } from "./WatchApp";

const root = document.getElementById("root");
if (!root) {
	throw new Error("观看页缺少 root 挂载节点");
}

createRoot(root).render(
	<React.StrictMode>
		<WatchApp />
	</React.StrictMode>,
);
