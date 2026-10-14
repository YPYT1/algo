import { con_log } from "../main";

interface ForwardNode {
	value: number;
	next: ForwardNode | null;
}

// 数组末尾为栈顶，从栈底到栈顶打印；不修改原数组。
function printArrayStack(stack: readonly number[]): void {
	if (stack.length === 0) {
		con_log("空栈");
		return;
	}

	con_log(`栈底 -> ${stack.join(" -> ")} -> 栈顶`);
}

// 链表头节点为栈顶，收集节点值后反向打印，从栈底到栈顶。
function printLinkedStack(head: ForwardNode | null): void {
	if (head === null) {
		con_log("空栈");
		return;
	}

	const values: number[] = [];
	let current: ForwardNode | null = head;
	while (current !== null) {
		values.push(current.value);
		current = current.next;
	}

	con_log(`栈底 -> ${values.reverse().join(" -> ")} -> 栈顶`);
}

export { printArrayStack, printLinkedStack };
