import { con_log } from "../main";

class ListNode {
	value: number;
	next: ListNode | null = null;
	constructor(value: number, node: ListNode | null = null) {
		this.value = value;
		this.next = node;
	}
}

class ListNodeStack {
	private stackPack: ListNode | null; // 将头节点作为栈顶
	private Stksize: number = 0; // 栈的长度
	constructor() {
		this.stackPack = null;
	}

	//获取栈的长度
	get stackLengh(): number {
		return this.Stksize;
	}
	/* 判断栈是否为空 */
	stackIsEmpty(): boolean {
		return this.Stksize === 0;
	}
	/* 入栈 */
	push(value: number): void {
		const node = new ListNode(value);
		node.next = this.stackPack;
		this.stackPack = node;
		this.Stksize++;
	}
	/* 出栈 */
	pop(): number | null {
		const num = this.peek();
		this.stackPack = this.stackPack!.next;
		this.Stksize--;
		return num;
	}
	/* 访问栈顶元素 */
	peek(): number | null {
		if (this.stackPack === null) throw new Error("栈为空");
		return this.stackPack.value;
	}
	/* 将链表转化为 Array 并返回 */
}

const stack = new ListNodeStack();
stack.pop();
con_log(stack.stackIsEmpty());
con_log(stack.peek());
