/**
 * 倒计时项目的接口
 */
export interface CountdownItem {
	date: string;
	title: string; // 必需字段，不能为空
	color?: string; // 可选，默认值在设置中处理
	format?: string; // 可选，默认值在设置中处理
}

/**
 * 倒计时项目列表类型
 */
export type CountdownItems = CountdownItem[];
