/**
 * Array-backed list utilities.
 * Implementations go here.
 */
class ListNode{
    value: number;
    next: ListNode | null;
    constructor(value: number, next: ListNode | null = null){
        this.value = value === undefined ? 0 : value;
        this.next = next === undefined ? null : next;
    }
}
const n0 = new ListNode(0);
const n1 = new ListNode(1);
const n2 = new ListNode(2);
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

// let current = n0;
// while (current !== null) {
//     console.log(current.value);
//     current = current.next as ListNode;
// }
// function insert(n0: ListNode, P: ListNode): void {
//     const n1 = n0.next;
//     P.next = n1;
//     n0.next = P;
// }
//在n0和n1之间插入p，p=15,顺序也就是n0-p-n1
function insert(n0: ListNode, P: ListNode): void {
    const n1 = n0.next; //先保存
    P.next = n1; //断开指向
    n0.next = P; //插入新节点
}
const p = new ListNode(15);
insert(n0, p);

let current = n0;
while (current !== null) {
    console.log(current.value);
    current = current.next as ListNode;
}

console.log("--------------------------------");
//删除节点p,P是待删除节点
function remove(n0: ListNode): void {
    if(!n0.next){
        return;
    }
    //n0- P -n1
    const P = n0.next;
    const n1 = P.next;
    n0.next = n1;
}
