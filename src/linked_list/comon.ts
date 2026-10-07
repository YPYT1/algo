import { con_log } from "../main";

interface ForwardNode {
	value: number;
	next: ForwardNode | null;
}

// 从头节点开始打印一圈；空链表输出“空链表”。
function printCycleList(head: ForwardNode | null): void {
	if (head === null) {
		con_log("空链表");
		return;
	}

	const values: number[] = [];
	let current: ForwardNode | null = head;
	do {
		values.push(current.value);
		current = current.next;
	} while (current !== null && current !== head);

	con_log(values.join("->"));
}

export { printCycleList };
