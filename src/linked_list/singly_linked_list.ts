/**
 * 单向链表基础操作演示
 *
 * 包含：节点定义、遍历、插入、删除、按位置访问、按值查找
 * 注意：链表节点值刻意不等于其位置（0 -> 20 -> 30 -> ...），
 * 用于区分「按位置访问」与「按值查找」两种语义。
 */

// ========== 1. 节点定义 ==========

class ListNode {
	value: number;
	next: ListNode | null;

	constructor(value: number, next: ListNode | null = null) {
		this.value = value;
		this.next = next;
	}
}

// ========== 2. 构建链表：0 -> 20 -> 30 -> 3 -> 4 -> ... -> 8 ==========

const n0 = new ListNode(0);
const n1 = new ListNode(20);
const n2 = new ListNode(30);
const n3 = new ListNode(3);
const n4 = new ListNode(4);
const n5 = new ListNode(5);
const n6 = new ListNode(6);
const n7 = new ListNode(7);
const n8 = new ListNode(8);

n0.next = n1;
n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;
n5.next = n6;
n6.next = n7;
n7.next = n8;
n8.next = null;

// 待插入的节点（值为 15）
const p = new ListNode(15);

// ========== 3. 插入：在 n0 之后插入 P（n0 - P - n1）==========
// 时间复杂度：O(1)
function insert(n0: ListNode, P: ListNode): void {
	const next = n0.next; // 1. 先保存后继节点
	P.next = next; // 2. 新节点指向后继
	n0.next = P; // 3. 前驱指向新节点
}

// ========== 4. 删除：删除 n0 的后继节点 ==========
// 时间复杂度：O(1)
function remove(n0: ListNode): void {
	if (!n0.next) {
		return; // 后继为空，无节点可删
	}
	const P = n0.next; // 待删除节点
	const next = P.next; // 保存待删节点的后继
	n0.next = next; // 前驱直接指向后继，跳过待删节点
}

// ========== 5. 按位置访问：返回第 index 个节点（0-based）==========
// 越界返回 null
// 时间复杂度：O(n)，最坏需走 index 步
function access(head: ListNode | null, index: number): ListNode | null {
	for (let i = 0; i < index; i++) {
		if (!head) {
			return null; // 越界提前退出
		}
		head = head.next;
	}
	return head;
}

// ========== 6. 按值查找：返回 target 首次出现的位置（0-based）==========
// 找不到返回 -1
// 时间复杂度：O(n)
function access_index(head: ListNode | null, target: number): number {
	let current = head;
	let i = 0;
	while (current !== null) {
		if (current.value === target) {
			return i; // 命中：返回 0-based 位置
		}
		current = current.next;
		i++;
	}
	return -1; // 未找到
}

// ========== 7. 按位置取值：返回第 index 个节点的值 ==========
// 越界返回 null
// 时间复杂度：O(n)
function access_number(head: ListNode | null, index: number): number | null {
	let current = head;
	let i = 0;
	while (current !== null) {
		if (i === index) {
			return current.value; // 命中：返回该位置的值
		}
		current = current.next;
		i++;
	}
	return null; // 越界
}

// ========== 8. 辅助：打印整个链表 ==========
function printList(head: ListNode | null): void {
	const values: number[] = [];
	let current = head;
	while (current !== null) {
		values.push(current.value);
		current = current.next;
	}
	console.log(values.join(" -> "));
}

// ========== 演示 ==========

console.log("初始链表：");
printList(n0);
console.log("=======================");

// insert(n0, p);
// console.log("\n在 n0 后插入 15：");
// printList(n0);

// console.log("\n位置 2 的节点值：", access_number(n0, 2));
// console.log("位置 2 的节点值（access）：", access(n0, 2)?.value);
// console.log("值 15 所在的位置：", access_index(n0, 15));
// console.log("值 99 所在的位置：", access_index(n0, 99));
// console.log("越界位置 99 的值：", access_number(n0, 99));

// remove(n0);
// console.log("\n删除 n0 的后继（即 15）：");
// printList(n0);

export {};
