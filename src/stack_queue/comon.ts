import { con_log } from "../main";

interface ForwardNode {
	value: number;
	next: ForwardNode | null;
}

interface QueueNode {
	value: number;
	next: QueueNode | null;
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

// 数组按队头到队尾存储；不修改原数组。
function printArrayQueue(queue: readonly number[]): void {
	if (queue.length === 0) {
		con_log("空队列");
		return;
	}

	con_log(`队头 -> ${queue.join(" -> ")} -> 队尾`);
}

// 链表头节点为队头，沿 next 指针打印到队尾。
function printLinkedQueue(head: QueueNode | null): void {
	if (head === null) {
		con_log("空队列");
		return;
	}

	const values: number[] = [];
	let current: QueueNode | null = head;
	while (current !== null) {
		values.push(current.value);
		current = current.next;
	}

	con_log(`队头 -> ${values.join(" -> ")} -> 队尾`);
}

export { printArrayStack, printLinkedStack, printArrayQueue, printLinkedQueue };
