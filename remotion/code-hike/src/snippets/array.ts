/**
 * 数组小节代码片段
 * 来源：Hello 算法 第 4 章官方 TypeScript
 * https://raw.githubusercontent.com/krahets/hello-algo/main/codes/typescript/chapter_array_and_linkedlist/array.ts
 */

export const ARRAY_INIT = `/* 初始化数组 */
// 整个数组均被初始化为 0
const arr: number[] = new Array(5).fill(0);
// 使用初始列表来初始化数组
let nums: number[] = [1, 3, 2, 5, 4];
`;

export const ARRAY_ACCESS = `/* 随机访问元素 */
function randomAccess(nums: number[]): number {
    // 在区间 [0, nums.length) 中随机抽取一个数字
    const i = Math.floor(Math.random() * nums.length);
    // 获取并返回随机元素
    const random_num = nums[i];
    return random_num;
}

/* Driver Code */
const nums: number[] = [1, 3, 2, 5, 4];
const random_num = randomAccess(nums); // 例如 5
`;

export const ARRAY_INSERT = `/* 在数组的索引 index 处插入元素 num */
function insert(nums: number[], num: number, index: number): void {
    // 把索引 index 以及之后的所有元素向后移动一位
    for (let i = nums.length - 1; i > index; i--) {
        nums[i] = nums[i - 1];
    }
    // 将 num 赋给 index 处的元素
    nums[index] = num;
}

/* Driver Code */
const nums: number[] = [1, 3, 2, 5, 4];
insert(nums, 6, 1);
// nums = [1, 6, 3, 2, 5]
`;

export const ARRAY_REMOVE = `/* 删除索引 index 处的元素 */
function remove(nums: number[], index: number): void {
    // 把索引 index 之后的所有元素向前移动一位
    for (let i = index; i < nums.length - 1; i++) {
        nums[i] = nums[i + 1];
    }
}

/* Driver Code */
const nums: number[] = [1, 3, 2, 5, 4];
remove(nums, 2);
// nums = [1, 3, 5, 4, 4]
`;

export const ARRAY_TRAVERSE = `/* 遍历数组 */
function traverse(nums: number[]): void {
    let count = 0;
    // 通过索引遍历数组
    for (let i = 0; i < nums.length; i++) {
        count += nums[i];
    }
    // 直接遍历数组元素
    for (const num of nums) {
        count += num;
    }
}
`;

export const ARRAY_FIND = `/* 在数组中查找指定元素 */
function find(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
}
`;

export const ARRAY_EXTEND = `/* 扩展数组长度 */
// 本函数将 Array 看作长度不可变的数组
function extend(nums: number[], enlarge: number): number[] {
    // 初始化一个扩展长度后的数组
    const res = new Array(nums.length + enlarge).fill(0);
    // 将原数组中的所有元素复制到新数组
    for (let i = 0; i < nums.length; i++) {
        res[i] = nums[i];
    }
    // 返回扩展后的新数组
    return res;
}
`;
