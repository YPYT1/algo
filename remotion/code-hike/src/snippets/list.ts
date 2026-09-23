/**
 * 列表小节代码片段
 * 来源：Hello 算法 第 4 章官方 TypeScript
 * https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/chapter_array_and_linkedlist/my_list.ts
 */

export const LIST_NATIVE = `/* 列表常用操作 */
const nums: number[] = [1, 3, 2, 5, 4];
// 尾部添加元素
nums.push(6);
// 在索引 3 处插入元素 0
nums.splice(3, 0, 0);
// 删除索引 3 处的元素
nums.splice(3, 1);
// 遍历列表
for (const num of nums) {
    console.log(num);
}
// 拼接列表
const res: number[] = nums.concat([7, 8]);
// 排序（默认升序）
res.sort((a, b) => a - b);
`;

export const MYLIST_MODEL = `/* 列表类 */
class MyList {
    private arr: Array<number>;       // 底层数组
    private _capacity: number = 10;   // 列表容量
    private _size: number = 0;        // 列表长度（当前元素数量）
    private extendRatio: number = 2;  // 每次列表扩容的倍数

    /* 构造方法 */
    constructor() {
        this.arr = new Array(this._capacity);
    }

    /* 获取列表长度（当前元素数量）*/
    public size(): number {
        return this._size;
    }

    /* 获取列表容量 */
    public capacity(): number {
        return this._capacity;
    }
}
`;

export const MYLIST_CRUD = `/* 访问元素 */
public get(index: number): number {
    // 索引如果越界，则抛出异常，下同
    if (index < 0 || index >= this._size) throw new Error("索引越界");
    return this.arr[index];
}

/* 在中间插入元素 */
public insert(index: number, num: number): void {
    if (index < 0 || index >= this._size) throw new Error("索引越界");
    // 数量超出容量时，触发扩容机制
    if (this._size === this._capacity) this.extendCapacity();
    // 将索引 index 以及之后的元素都向后移动一位
    for (let j = this._size - 1; j >= index; j--) {
        this.arr[j + 1] = this.arr[j];
    }
    this.arr[index] = num;
    this._size++;
}

/* 删除元素 */
public remove(index: number): number {
    let num = this.arr[index];
    // 将索引 index 之后的元素都向前移动一位
    for (let j = index; j < this._size - 1; j++) {
        this.arr[j] = this.arr[j + 1];
    }
    this._size--;
    return num;
}
`;

export const MYLIST_RESIZE = `/* 在尾部添加元素 */
public add(num: number): void {
    // 如果长度等于容量，则需要扩容
    if (this._size === this._capacity) this.extendCapacity();
    this.arr[this._size] = num;
    this._size++;
}

/* 列表扩容 */
public extendCapacity(): void {
    // 新建一个更长的数组，并将原数组复制到新数组
    this.arr = this.arr.concat(
        new Array(this.capacity() * (this.extendRatio - 1))
    );
    // 更新列表容量
    this._capacity = this.arr.length;
}
`;
