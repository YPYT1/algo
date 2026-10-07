//双向链表

//定义双向链表
class DoublyListNode {
	value: number;
	prior: DoublyListNode | null;
	next: DoublyListNode | null;
	constructor(
		value: number,
		prior: DoublyListNode | null = null,
		next: DoublyListNode | null = null,
	) {
		this.value = value;
		this.prior = prior;
		this.next = next;
	}
}

//初始化双向链表
const n0 = new DoublyListNode(0);
const n1 = new DoublyListNode(1);
const n2 = new DoublyListNode(2);
const n3 = new DoublyListNode(3);
const n4 = new DoublyListNode(4);
const n5 = new DoublyListNode(5);
const n6 = new DoublyListNode(6);

n0.next = n1;
n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;
n5.next = n6;

n1.prior = n0;
n2.prior = n1;
n3.prior = n2;
n4.prior = n3;
n5.prior = n4;
n6.prior = n5;

//顺序打印链表
function printDoublyListNode(head: DoublyListNode | null): void {
	const values: number[] = [];
	let current = head;
	while (current !== null) {
		values.push(current.value);
		current = current.next;
	}
	console.log(values.join("->"));
}

//反向打印链表
function printReverse(head: DoublyListNode | null = null): void {
	const values: number[] = [];
	let current = head;
	while (current !== null) {
		values.push(current.value);
		current = current.prior;
	}
	console.log(values.join("->"));
}
//=========输出链表==========
// printDoublyListNode(n0);

//双向链表插入数据 在n0和n1之间插入节点p（20）
const p = new DoublyListNode(20);
function insert(node: DoublyListNode | null, newNode: DoublyListNode): void {
	if (node === null) {
		return;
	}

	const next = node.next;
	newNode.prior = node;
	newNode.next = next;
	node.next = newNode;

	if (next !== null) {
		next.prior = newNode;
	}
}

//双向链表删除数据-按节点删除
function deleteindex(node: DoublyListNode | null = null): void {
	if (node === null) return;
	const prior = node.prior;
	const next = node.next;
	//
	if (prior !== null) {
		prior.next = next;
	}
	//
	if (next !== null) {
		next.prior = prior;
	}
	node.prior = null;
	node.next = null;
}

//双向链表删除数据-按节点值删除
let head: DoublyListNode | null = n0;
function deletevalue(targetnumber: number): void {
	let current = head;
	while (current !== null) {
		if (current.value === targetnumber) {
			const prior = current.prior;
			const next = current.next;
			if (prior !== null) {
				prior.next = next;
			} else {
				head = next;
			}
			if (next !== null) {
				next.prior = prior;
			}
			current.prior = null;
			current.next = null;
			return;
		}
		current = current.next;
	}
}
//双向链表修改数据--按节点修改
function changeIndex(node: DoublyListNode | null, number: number): void {
	if (node === null) return;
	node.value = number;
}
//双向链表修改数据--按值修改
function changeValue(berforNumber: number, afterNumber: number): void {
	if (berforNumber === afterNumber) return;
	let current = head;
	while (current !== null) {
		if (current?.value === berforNumber) {
			// console.log(":1");
			current.value = afterNumber;
		}
		current = current.next;
	}
}

//查找数值
function foundVaule(node: DoublyListNode | null = null): number | null {
	if (node === null) return null;
	return node.value;
}
//按照值查找节点
function foundheadOfvalue(value: number): DoublyListNode | null {
	return null;
}
//=========输出链表==========
// printDoublyListNode(n0);
// insert(n6,p);
// printReverse(p);
// printDoublyListNode(head);
// deletevalue(0);
printDoublyListNode(n0);
// changeValue(0,10);
console.log(foundVaule(n2));

// printDoublyListNode(n0);

export {};
