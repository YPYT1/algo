import { con_log } from "../main";
import { printLinkedQueue } from "./comon";

class ListNode {
	value: number;
	next: ListNode | null;
	constructor(value: number, node: ListNode | null = null) {
		this.value = value;
		this.next = node;
	}
}
class ListNodeQueue{
    private head: ListNode | null;
    private tail: ListNode | null;
    private queueSize: number = 0;

    constructor(){
        this.head = null; //队首
        this.tail = null; //队尾
    }

    get Head(): ListNode | null {
        return this.head;
    }

    get Sizequeue(): number{
        return this.queueSize;
    }
    
    //元素入队 | 排在末尾
    push(value: number):void{
        const node = new ListNode(value);
        //队列为空
        if(this.head === null){
            this.head = node;
            this.tail = node;
        }else{
            if(this.tail === null) throw new Error("队列状态异常：tail 为 null");
            //队列不空
            this.tail.next = node;
            this.tail = node;
        }
        this.queueSize++;
        return; 
    }

    //元素出队 | 队首先走
    pop(): number{
        //如果队为空
        if(this.head === null && this.tail === null){
            throw new Error("队列为空");
        }else if(this.head === this.tail){
            return this.head!.value;
            
        }
        return 0
    }

    //访问队列元素 | 按照节点访问
    peek(): number{
        return 0;
    }

    //修改队列元素 | 按照节点访问
    updateAt(index: ListNode, value: number): boolean{
        return false;
    }
}

const queue = new ListNodeQueue();

queue.push(1);
queue.push(2);
queue.push(3);
queue.push(4);
queue.push(5);

printLinkedQueue(queue.Head);
con_log(queue.Sizequeue);