//双向链表

//定义双向链表
class DoublyListNode{
    value: number;
    prior: DoublyListNode | null;
    next: DoublyListNode | null;
    constructor(
        value: number,
        prior: DoublyListNode | null = null,
        next: DoublyListNode | null = null,
    ){
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
    while(current !== null){
        values.push(current.value);
        current = current.next;
    }
    console.log(values.join("->"));
}

//反向打印链表
function printReverse(head: DoublyListNode | null = null): void {
    const values: number[] = [];
    let current = head;
    while(current !== null){
        values.push(current.value);
        current = current.prior;
    }
    console.log(values.join("->"));
}
//=========输出链表==========
printDoublyListNode(n0);

//双向链表插入数据 在n0和n1之间插入节点p（20）
const p = new DoublyListNode(20);
function insert(node: DoublyListNode,newNode:DoublyListNode):void {
    if(node === null){
        return;
    }
    const next = node.next;
    node.next
    
}

//双向链表删除数据


//=========输出链表==========
printDoublyListNode(n0);
printReverse(n6);


export{};