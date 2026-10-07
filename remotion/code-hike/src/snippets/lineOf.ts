/** 按「包含某段文本」定位行号（1-based），避免手数行号出错；找不到时回退为第 1 行 */
export const lineOf = (code: string, needle: string): number => {
	const index = code.split("\n").findIndex((line) => line.includes(needle));
	return index === -1 ? 1 : index + 1;
};

/** 一次取多行（仍按文本定位） */
export const linesOf = (code: string, ...needles: string[]): number[] =>
	needles.map((needle) => lineOf(code, needle));
