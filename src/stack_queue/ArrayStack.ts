// 数组实现栈

import { con_log } from "../main";
import { printArrayStack } from "./comon";
class ArrayStack {
	array: number[] = [];
	private Stksize: number = 0;

	//栈的长度
	get StkLength(): number {
		// if(this.Stksize === 0) throw new Error("Stk is Null");
		return this.Stksize;
	}

	//栈是否为空
	Stack_Is_Null(): boolean {
		if (this.Stksize === 0) return true;
		return false;
	}

	//入栈
	Push(vaule: number): void {
		this.array.push(vaule);
		this.Stksize++;
	}

	//取栈顶元素
	Peek_Top(): number | null {
		const topValue = this.array[this.array.length - 1];
		if (topValue === undefined) throw new Error("栈为空");
		return topValue;
	}

	//取栈底元素
	Peek_Down(): number | null {
		const bottomValue = this.array[0];
		if (bottomValue === undefined) throw new Error("栈为空");
		return bottomValue;
	}

	//出栈
	pop(): number | null {
		if (this.Stack_Is_Null() === true) throw new Error("栈为空");
		const TopVaule = this.array[this.array.length - 1];
		if (TopVaule === undefined) {
			throw new Error("栈为空");
		}
		this.array.length--;
		this.Stksize--;
		return TopVaule;
	}

	//反转栈
	Revese_Stack(): void {
		if (this.Stack_Is_Null() === true) return;
		let i = 0;
		let j = this.array.length - 1;
		while (i < j) {
			const value_j = this.array[j];
			const value_i = this.array[i];
			if (value_j === undefined || value_i === undefined) {
				throw new Error("数组下标无效");
			}
			this.array[j] = value_i;
			this.array[i] = value_j;
			i++;
			j--;
		}
	}
}
const stack = new ArrayStack();

stack.Push(1);
stack.Push(2);
stack.Push(3);
stack.Push(4);
stack.Push(5);
stack.Push(6);

printArrayStack(stack.array);
con_log("----------反转-------");
stack.Revese_Stack();
printArrayStack(stack.array);
// con_log(stack.StkLength);
// con_log(stack.Revese_Stack());
