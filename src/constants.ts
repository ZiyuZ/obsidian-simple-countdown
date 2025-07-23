/**
 * 插件常量定义
 */

// 默认颜色
export const DEFAULT_COLOR = "#007bff";

// 时间常量（毫秒）
export const TIME_CONSTANTS = {
	SECOND: 1000,
	MINUTE: 60 * 1000,
	HOUR: 60 * 60 * 1000,
	DAY: 24 * 60 * 60 * 1000,
	WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// 字体大小范围
export const FONT_SIZE_LIMITS = {
	DATE: { min: 10, max: 24 },
	TITLE: { min: 16, max: 36 },
	TIME: { min: 16, max: 32 },
} as const;

// 颜色验证正则
export const COLOR_REGEX = {
	HEX_6: /^#[0-9a-fA-F]{6}$/,
	HEX_3: /^#[0-9a-fA-F]{3}$/,
} as const;

// 更新间隔
export const UPDATE_INTERVAL = 1000; // 1秒
