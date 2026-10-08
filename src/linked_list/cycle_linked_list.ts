import { con_log } from "../main";
import { printCycleList } from "./comon";

//初始化循环链表
class Cyclelinked {
	value: number;
	next: Cyclelinked | null = null;
	constructor(value: number, next: Cyclelinked | null = null) {
		this.value = value;
		this.next = next;
	}
}

const n0 = new Cyclelinked(0);
const n1 = new Cyclelinked(1);
const n2 = new Cyclelinked(2);
const n3 = new Cyclelinked(3);
const n4 = new Cyclelinked(4);
const n5 = new Cyclelinked(5);
const n6 = new Cyclelinked(6);
n0.next = n1;
n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;
n5.next = n6;
n6.next = n0;
//插入数据
function insert(node: Cyclelinked | null = null, value: number): void {
	let current = node;
	if (current === null) return;
	const newNode = new Cyclelinked(value);
	const next = current.next;
	current.next = newNode;
	newNode.next = next;
}

//删除数据（需要找到他的前一个节点）
function deleteNode(node: Cyclelinked | null = null): void {
	if (node === null) {
		con_log("node is null");
		return;
	}
	if (node.next === node) {
		node.next = null;
		return;
	}
	let previous = node;
	while (previous.next !== node) {
		previous = previous.next!;
	}
	previous.next = node.next;
	node.next = null;
}
//修改数据
function changeValue(
	node: Cyclelinked | null = null,
	targetNumber: number,
): string {
	if (node === null) return "node is null";
	if (node.value === targetNumber) {
		return "数值相同";
	}
	node.value = targetNumber;
	return "修改成功";
}
//查询节点数据
function QueryVaule(node: Cyclelinked | null = null): number | null {
	if (node === null) return null;
	return node.value;
}

//根据数据查询节点
function QueryNodeOfValue(
	head: Cyclelinked | null = null,
	value: number,
): Cyclelinked | null {
	if (head === null) return null;
	let current: Cyclelinked | null = null;
	current = head;
	do {
		if (current.value === value) return current;
		current = current.next;
	} while (current !== null && current !== head)
	return null;
}

//==============打印=======
// printCycleList(n4);
// insert(n1,20)

// deleteNode(n2);
// con_log(QueryVaule(n0));
con_log(QueryNodeOfValue(n0, 3));
printCycleList(n0);
