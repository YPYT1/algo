import type React from "react";
import { SceneShell } from "../../components/layout/SceneShell";
import {
	LinkedListNodes,
	type LLEdge,
	type LLNode,
} from "../../components/viz/LinkedListNodes";
import { type Beat, between, useScene } from "../../motion/useSceneProgress";
import { lineOf } from "../../snippets/lineOf";
import { LL_REMOVE } from "../../snippets/linked-list";

/**
 * 删除场景舞台：链 n0(1) → n1(3) → n2(2) → n3(5) → n4(4)。
 * remove(n0) 删的是前驱 n0 的后继 n1（参数是 n0，不是被删节点）。
 */
const STAGE = { width: 1180, height: 620 };
const STAGE_SCALE = 0.79;

const BASE_NODES: LLNode[] = [
	{ id: "n0", name: "n0", val: 1, x: 20, y: 170 },
	{ id: "n1", name: "n1", val: 3, x: 250, y: 250 },
	{ id: "n2", name: "n2", val: 2, x: 480, y: 170 },
	{ id: "n3", name: "n3", val: 5, x: 710, y: 250 },
	{ id: "n4", name: "n4", val: 4, x: 940, y: 170 },
];

export const linkedListRemoveBeats: Beat[] = [
	{
		phase: "idle",
		durationInFrames: 22,
		caption: "单链表删除看前驱：改的是前驱的指针，不是删它自己",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 30,
		codeLines: [lineOf(LL_REMOVE, "const P = n0.next")],
		caption: "① const P = n0.next：待删节点是 P（n0 的后继）",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 28,
		codeLines: [lineOf(LL_REMOVE, "const n1 = P.next")],
		caption: "② const n1 = P.next：记住 P 后面的节点",
	},
	{
		phase: "highlight-code-line",
		durationInFrames: 26,
		codeLines: [lineOf(LL_REMOVE, "n0 -> P -> n1")],
		caption: "三者关系：n0（前驱）→ P（待删）→ n1（后继）",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 48,
		codeLines: [lineOf(LL_REMOVE, "n0.next = n1")],
		caption: "③ n0.next = n1：让前驱直接跳到 n1，链表绕过 P",
	},
	{
		phase: "mutate-viz",
		durationInFrames: 40,
		caption: "P 被跳过 → 变红、断开、淡出",
	},
	{
		phase: "emphasize-result",
		durationInFrames: 38,
		caption: "链表变成 1 → 2 → 5 → 4",
	},
	{
		phase: "caption",
		durationInFrames: 34,
		caption: "删谁就改谁前面那个节点的指针 → O(1)（已持有前驱）",
	},
];

const RemoveViz: React.FC = () => {
	const t = useScene();

	const markedP = between(t.frame, t.startOf(1) + 3, t.startOf(1) + 18);
	const markedN1 = between(t.frame, t.startOf(2) + 3, t.startOf(2) + 18);
	const rewire = between(t.frame, t.startOf(4) + 6, t.startOf(4) + 34);
	const fade = between(t.frame, t.startOf(5) + 4, t.startOf(5) + 30);
	const done = t.beatIndex >= 6;

	const nodes: LLNode[] = BASE_NODES.map((node) => {
		if (node.id === "n1") {
			// 待删节点：先橙色标记（前驱的后继），重连后变红淡出
			const tone =
				t.beatIndex >= 4 ? "danger" : markedP > 0 ? "focus" : "default";
			return {
				...node,
				tone,
				opacity: t.beatIndex >= 5 ? 1 - fade : 1,
				scale: t.beatIndex >= 5 ? 1 - fade * 0.2 : 1,
				note:
					t.beatIndex >= 1 && t.beatIndex <= 3
						? "P = n0.next（待删）"
						: undefined,
			};
		}
		if (node.id === "n2") {
			return {
				...node,
				tone:
					t.beatIndex >= 2 && t.beatIndex <= 3
						? markedN1 > 0
							? "info"
							: "default"
						: "default",
				note: t.beatIndex >= 2 && t.beatIndex <= 3 ? "n1 = P.next" : undefined,
			};
		}
		if (node.id === "n0" && t.beatIndex >= 1 && t.beatIndex <= 6) {
			return { ...node, tone: "compare" };
		}
		return { ...node };
	});

	const allEdges: LLEdge[] = [
		// 前驱 → 待删节点 P：先高亮，重连时变红断开并淡出
		{
			id: "pre-to-P",
			from: "n0",
			to: "n1",
			tone: rewire > 0 ? "danger" : t.beatIndex >= 1 ? "focus" : "default",
			opacity: t.beatIndex >= 4 ? 1 - rewire : 1,
			dashed: t.beatIndex >= 4 && rewire > 0 && rewire < 1,
			label: t.beatIndex >= 1 && t.beatIndex < 4 ? "P" : undefined,
		},
		// P → n1（后半段）：P 淡出后随之消失
		{
			id: "P-to-next",
			from: "n1",
			to: "n2",
			tone: t.beatIndex >= 2 && t.beatIndex <= 3 ? "info" : "default",
			opacity: t.beatIndex >= 5 ? 1 - fade : 1,
			label: t.beatIndex >= 2 && t.beatIndex < 4 ? "n1" : undefined,
		},
		// n0 → n1（新链）：n0.next = n1，跨过 P
		{
			id: "pre-to-next",
			from: "n0",
			to: "n2",
			tone: done ? "fresh" : "focus",
			opacity: rewire,
			bend: -70,
			label: rewire > 0.8 ? "n0.next = n1" : undefined,
		},
		{ id: "n2-n3", from: "n2", to: "n3", tone: "default" },
		{ id: "n3-n4", from: "n3", to: "n4", tone: "default" },
	];
	const edges = allEdges.filter(
		(edge) => !(edge.id === "pre-to-next" && rewire <= 0),
	);

	return (
		<LinkedListNodes
			nodes={nodes}
			edges={edges}
			stage={STAGE}
			scale={STAGE_SCALE}
		/>
	);
};

export const LinkedListRemove: React.FC = () => (
	<SceneShell
		beats={linkedListRemoveBeats}
		title="删除节点"
		section="4.2 链表"
		badge={{ label: "O(1)", tone: "green" }}
		code={LL_REMOVE}
		codeTitle="linked_list.ts"
	>
		<RemoveViz />
	</SceneShell>
);
