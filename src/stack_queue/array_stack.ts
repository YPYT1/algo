import { printArrayStack, printLinkedStack } from "./comon.ts";
import { con_log } from "../main.ts";

//初始化栈
const stack: number[] = [];

//入栈
stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);
stack.push(5);
stack.push(6);

stack.pop();

const size = stack.length + 1;

const is_Empty = stack.length === 0;

printArrayStack(stack);
