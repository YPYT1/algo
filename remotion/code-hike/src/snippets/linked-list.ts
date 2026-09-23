/**
 * 链表小节代码片段
 * 来源：Hello 算法 第 4 章官方 TypeScript
 * https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/chapter_array_and_linkedlist/linked_list.ts
 * https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/modules/ListNode.ts
 */

export const LL_NODE = `/* 链表节点 */
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}
`;

export const LL_INIT = `/* 初始化链表 */
// 初始化各个节点
const n0 = new ListNode(1);
const n1 = new ListNode(3);
const n2 = new ListNode(2);
const n3 = new ListNode(5);
const n4 = new ListNode(4);
// 构建节点之间的引用
n0.next = n1;
n1.next = n2;
n2.next = n3;
n3.next = n4;
`;

export const LL_INSERT = `/* 在链表的节点 n0 之后插入节点 P */
function insert(n0: ListNode, P: ListNode): void {
    const n1 = n0.next;
    P.next = n1;
    n0.next = P;
}

/* Driver Code */
const n0 = new ListNode(1);
const P = new ListNode(6);
insert(n0, P);
`;

export const LL_REMOVE = `/* 删除链表的节点 n0 之后的首个节点 */
function remove(n0: ListNode): void {
    if (!n0.next) {
        return;
    }
    // n0 -> P -> n1
    const P = n0.next;
    const n1 = P.next;
    n0.next = n1;
}
`;

export const LL_ACCESS = `/* 访问链表中索引为 index 的节点 */
function access(
    head: ListNode | null,
    index: number
): ListNode | null {
    for (let i = 0; i < index; i++) {
        if (!head) {
            return null;
        }
        head = head.next;
    }
    return head;
}
`;

export const LL_FIND = `/* 在链表中查找值为 target 的首个节点 */
function find(head: ListNode | null, target: number): number {
    let index = 0;
    while (head !== null) {
        if (head.val === target) {
            return index;
        }
        head = head.next;
        index += 1;
    }
    return -1;
}
`;

export const LL_VS_ARRAY = `/* 数组：插入要搬移后面所有元素 —— O(n) */
function insert(nums: number[], num: number, index: number): void {
    for (let i = nums.length - 1; i > index; i--) {
        nums[i] = nums[i - 1];
    }
    nums[index] = num;
}

/* 链表：插入只改三个指针 —— O(1)（已持有前驱） */
function insert(n0: ListNode, P: ListNode): void {
    const n1 = n0.next;
    P.next = n1;
    n0.next = P;
}
`;

export const LL_TYPES = `/* 常见链表类型 */
// 1. 单链表：节点只保存 next 指针
head.next = node1;

// 2. 双向链表：节点还保存 prev 指针
class DoublyListNode {
    val: number;
    next: DoublyListNode | null;
    prev: DoublyListNode | null;
}

// 3. 环形链表：尾节点的 next 指向头节点
tail.next = head;
`;
