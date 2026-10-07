import { printCycleList } from "./comon";

//初始化循环链表
class Cyclelinked {
	value: number;
	next: Cyclelinked | null;
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
//删除数据
function deleteNode(node: Cyclelinked | null = null): void {}
//修改数据

//删除数据

//==============打印=======
// printCycleList(n4);
// insert(n1,20)
printCycleList(n0);
