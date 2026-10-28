import { con_log } from "../main";

//双向队列
class ListNode {
    value: number;
    prev: ListNode | null;
    next: ListNode | null;
    constructor(
        value: number,
        prev: ListNode | null = null,
        next: ListNode | null = null
    ) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}


class DoubleEndedQueue {
    front: ListNode | null;//头节点
    rear: ListNode | null;//尾节点
    queSize: number;//队列长度
    constructor() {
        this.front = null;
        this.rear = null;
        this.queSize = 0;
    }
    //获取队列长度
    Size(): number {
        return this.queSize;
    }
    //将元素添加至队首	
    push_first(val: number): void {
        const node = new ListNode(val);
        if (this.queSize === 0) {
            this.front = node;
            this.rear = node;
            return;
        }
    }
    //将元素添加至队尾
    push_last() {
    }
    //从队首删除元素
    pop_first() {
    }
    //从队尾删除元素
    pop_last() {
    }
    //访问队首元素
    peek_first() {
    }
    //访问队尾元素
    peek_last() {
    }
}

