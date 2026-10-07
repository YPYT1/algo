import { totalFrames } from "../motion/useSceneProgress";
import { ArrayAccess, arrayAccessBeats } from "../scenes/array/ArrayAccess";
import { ArrayExtend, arrayExtendBeats } from "../scenes/array/ArrayExtend";
import { ArrayFind, arrayFindBeats } from "../scenes/array/ArrayFind";
import { ArrayInit, arrayInitBeats } from "../scenes/array/ArrayInit";
import { ArrayInsert, arrayInsertBeats } from "../scenes/array/ArrayInsert";
import { ArrayRemove, arrayRemoveBeats } from "../scenes/array/ArrayRemove";
import {
	ArrayTraverse,
	arrayTraverseBeats,
} from "../scenes/array/ArrayTraverse";
import {
	LinkedListAccess,
	linkedListAccessBeats,
} from "../scenes/linked-list/LinkedListAccess";
import {
	LinkedListFind,
	linkedListFindBeats,
} from "../scenes/linked-list/LinkedListFind";
import {
	LinkedListInit,
	linkedListInitBeats,
} from "../scenes/linked-list/LinkedListInit";
import {
	LinkedListInsert,
	linkedListInsertBeats,
} from "../scenes/linked-list/LinkedListInsert";
import {
	LinkedListNode,
	linkedListNodeBeats,
} from "../scenes/linked-list/LinkedListNode";
import {
	LinkedListRemove,
	linkedListRemoveBeats,
} from "../scenes/linked-list/LinkedListRemove";
import {
	LinkedListTypes,
	linkedListTypesBeats,
} from "../scenes/linked-list/LinkedListTypes";
import {
	LinkedListVsArray,
	linkedListVsArrayBeats,
} from "../scenes/linked-list/LinkedListVsArray";
import { ListNative, listNativeBeats } from "../scenes/list/ListNative";
import { MyListCrud, myListCrudBeats } from "../scenes/list/MyListCrud";
import { MyListModel, myListModelBeats } from "../scenes/list/MyListModel";
import { MyListResize, myListResizeBeats } from "../scenes/list/MyListResize";
import { ChapterToc, chapterTocBeats } from "../scenes/toc/ChapterToc";
import type { SceneDefinition } from "./types";

const captionsOf = (beats: { caption?: string }[]): string[] =>
	beats.map((beat) => beat.caption).filter((c): c is string => Boolean(c));

/**
 * 第 4 章场景注册表。
 * Composition id 使用中文，方便在 Remotion Studio 侧栏直接识别。
 */
export const chapter4Scenes: SceneDefinition[] = [
	{
		id: "目录",
		title: "第 4 章 · 数组与链表",
		section: "toc",
		durationInFrames: totalFrames(chapterTocBeats),
		beats: chapterTocBeats,
		component: ChapterToc,
		captions: captionsOf(chapterTocBeats),
		enabled: true,
	},

	// ---------- 4.1 数组 ----------
	{
		id: "数组-初始化",
		title: "初始化数组",
		section: "array",
		durationInFrames: totalFrames(arrayInitBeats),
		beats: arrayInitBeats,
		component: ArrayInit,
		snippetPath: "src/snippets/array.ts#ARRAY_INIT",
		captions: captionsOf(arrayInitBeats),
		enabled: true,
	},
	{
		id: "数组-访问元素",
		title: "访问元素",
		section: "array",
		durationInFrames: totalFrames(arrayAccessBeats),
		beats: arrayAccessBeats,
		component: ArrayAccess,
		snippetPath: "src/snippets/array.ts#ARRAY_ACCESS",
		captions: captionsOf(arrayAccessBeats),
		enabled: true,
	},
	{
		id: "数组-插入元素",
		title: "插入元素",
		section: "array",
		durationInFrames: totalFrames(arrayInsertBeats),
		beats: arrayInsertBeats,
		component: ArrayInsert,
		snippetPath: "src/snippets/array.ts#ARRAY_INSERT",
		captions: captionsOf(arrayInsertBeats),
		enabled: true,
	},
	{
		id: "数组-删除元素",
		title: "删除元素",
		section: "array",
		durationInFrames: totalFrames(arrayRemoveBeats),
		beats: arrayRemoveBeats,
		component: ArrayRemove,
		snippetPath: "src/snippets/array.ts#ARRAY_REMOVE",
		captions: captionsOf(arrayRemoveBeats),
		enabled: true,
	},
	{
		id: "数组-遍历",
		title: "遍历数组",
		section: "array",
		durationInFrames: totalFrames(arrayTraverseBeats),
		beats: arrayTraverseBeats,
		component: ArrayTraverse,
		snippetPath: "src/snippets/array.ts#ARRAY_TRAVERSE",
		captions: captionsOf(arrayTraverseBeats),
		enabled: true,
	},
	{
		id: "数组-查找元素",
		title: "查找元素",
		section: "array",
		durationInFrames: totalFrames(arrayFindBeats),
		beats: arrayFindBeats,
		component: ArrayFind,
		snippetPath: "src/snippets/array.ts#ARRAY_FIND",
		captions: captionsOf(arrayFindBeats),
		enabled: true,
	},
	{
		id: "数组-扩容",
		title: "扩容数组",
		section: "array",
		durationInFrames: totalFrames(arrayExtendBeats),
		beats: arrayExtendBeats,
		component: ArrayExtend,
		snippetPath: "src/snippets/array.ts#ARRAY_EXTEND",
		captions: captionsOf(arrayExtendBeats),
		enabled: true,
	},

	// ---------- 4.2 链表 ----------
	{
		id: "链表-节点结构",
		title: "节点结构",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListNodeBeats),
		beats: linkedListNodeBeats,
		component: LinkedListNode,
		snippetPath: "src/snippets/linked-list.ts#LL_NODE",
		captions: captionsOf(linkedListNodeBeats),
		enabled: true,
	},
	{
		id: "链表-初始化",
		title: "初始化链表",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListInitBeats),
		beats: linkedListInitBeats,
		component: LinkedListInit,
		snippetPath: "src/snippets/linked-list.ts#LL_INIT",
		captions: captionsOf(linkedListInitBeats),
		enabled: true,
	},
	{
		id: "链表-插入节点",
		title: "插入节点",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListInsertBeats),
		beats: linkedListInsertBeats,
		component: LinkedListInsert,
		snippetPath: "src/snippets/linked-list.ts#LL_INSERT",
		captions: captionsOf(linkedListInsertBeats),
		enabled: true,
	},
	{
		id: "链表-删除节点",
		title: "删除节点",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListRemoveBeats),
		beats: linkedListRemoveBeats,
		component: LinkedListRemove,
		snippetPath: "src/snippets/linked-list.ts#LL_REMOVE",
		captions: captionsOf(linkedListRemoveBeats),
		enabled: true,
	},
	{
		id: "链表-访问节点",
		title: "访问节点",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListAccessBeats),
		beats: linkedListAccessBeats,
		component: LinkedListAccess,
		snippetPath: "src/snippets/linked-list.ts#LL_ACCESS",
		captions: captionsOf(linkedListAccessBeats),
		enabled: true,
	},
	{
		id: "链表-查找节点",
		title: "查找节点",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListFindBeats),
		beats: linkedListFindBeats,
		component: LinkedListFind,
		snippetPath: "src/snippets/linked-list.ts#LL_FIND",
		captions: captionsOf(linkedListFindBeats),
		enabled: true,
	},
	{
		id: "链表-对比数组",
		title: "数组 vs 链表",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListVsArrayBeats),
		beats: linkedListVsArrayBeats,
		component: LinkedListVsArray,
		snippetPath: "src/snippets/linked-list.ts#LL_VS_ARRAY",
		captions: captionsOf(linkedListVsArrayBeats),
		enabled: true,
	},
	{
		id: "链表-常见类型",
		title: "常见链表类型",
		section: "linked-list",
		durationInFrames: totalFrames(linkedListTypesBeats),
		beats: linkedListTypesBeats,
		component: LinkedListTypes,
		snippetPath: "src/snippets/linked-list.ts#LL_TYPES",
		captions: captionsOf(linkedListTypesBeats),
		enabled: true,
	},

	// ---------- 4.3 列表 ----------
	{
		id: "列表-常用操作",
		title: "列表常用操作",
		section: "list",
		durationInFrames: totalFrames(listNativeBeats),
		beats: listNativeBeats,
		component: ListNative,
		snippetPath: "src/snippets/list.ts#LIST_NATIVE",
		captions: captionsOf(listNativeBeats),
		enabled: true,
	},
	{
		id: "列表-MyList模型",
		title: "MyList 三要素",
		section: "list",
		durationInFrames: totalFrames(myListModelBeats),
		beats: myListModelBeats,
		component: MyListModel,
		snippetPath: "src/snippets/list.ts#MYLIST_MODEL",
		captions: captionsOf(myListModelBeats),
		enabled: true,
	},
	{
		id: "列表-增删改查",
		title: "MyList 增删改查",
		section: "list",
		durationInFrames: totalFrames(myListCrudBeats),
		beats: myListCrudBeats,
		component: MyListCrud,
		snippetPath: "src/snippets/list.ts#MYLIST_CRUD",
		captions: captionsOf(myListCrudBeats),
		enabled: true,
	},
	{
		id: "列表-扩容机制",
		title: "MyList 扩容",
		section: "list",
		durationInFrames: totalFrames(myListResizeBeats),
		beats: myListResizeBeats,
		component: MyListResize,
		snippetPath: "src/snippets/list.ts#MYLIST_RESIZE",
		captions: captionsOf(myListResizeBeats),
		enabled: true,
	},
];

export const enabledScenes = chapter4Scenes.filter((scene) => scene.enabled);

export const chapter4FullDuration = enabledScenes.reduce(
	(sum, scene) => sum + scene.durationInFrames,
	0,
);
