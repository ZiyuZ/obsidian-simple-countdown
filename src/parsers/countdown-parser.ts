import dayjs from 'dayjs';

import {
  getLocale,
  type SupportedLanguage,
} from '../locale';
import type {
  CountdownItem,
  CountdownItems,
} from '../types';

/**
 * 验证单个倒计时项目的配置
 */
export const validateCountdownItem = (
	item: unknown,
	index: number,
	language: SupportedLanguage = "en",
): CountdownItem => {
	const locale = getLocale(language);

	// 检查是否为对象
	if (!item || typeof item !== "object") {
		throw new Error(locale.formatError(index + 1, JSON.stringify(item)));
	}

	const itemObj = item as Record<string, unknown>;

	// 验证日期字段
	if (!itemObj.date || typeof itemObj.date !== "string") {
		throw new Error(
			locale.dateInvalid(index + 1, String(itemObj.date || "undefined")),
		);
	}

	if (!dayjs(itemObj.date).isValid()) {
		throw new Error(locale.dateInvalid(index + 1, itemObj.date));
	}

	// 验证标题字段
	if (
		!itemObj.title ||
		typeof itemObj.title !== "string" ||
		itemObj.title.trim() === ""
	) {
		throw new Error(locale.titleRequired);
	}

	// 验证颜色字段（如果存在）
	if (
		itemObj.color &&
		typeof itemObj.color === "string" &&
		itemObj.color.trim() !== ""
	) {
		if (!itemObj.color.match(/^#[0-9a-fA-F]{3,6}$/)) {
			throw new Error(locale.colorInvalid(index + 1, itemObj.color));
		}
	}

	// 验证格式字段（如果存在）
	if (itemObj.format && typeof itemObj.format !== "string") {
		throw new Error(
			`Countdown item ${index + 1}: Format must be a string, got ${typeof itemObj.format}`,
		);
	}

	const validatedItem: CountdownItem = {
		date: itemObj.date,
		title: itemObj.title.trim(),
	};

	// 添加可选字段
	if (
		itemObj.color &&
		typeof itemObj.color === "string" &&
		itemObj.color.trim() !== ""
	) {
		validatedItem.color = itemObj.color.trim();
	}

	if (
		itemObj.format &&
		typeof itemObj.format === "string" &&
		itemObj.format.trim() !== ""
	) {
		validatedItem.format = itemObj.format.trim();
	}

	return validatedItem;
};

/**
 * 验证整个倒计时项目列表
 */
export const validateCountdownItems = (
	items: unknown,
	language: SupportedLanguage = "en",
): CountdownItems => {
	const locale = getLocale(language);

	// 检查是否为数组
	if (!Array.isArray(items)) {
		throw new Error(locale.arrayFormatRequired);
	}

	// 检查是否为空数组
	if (items.length === 0) {
		throw new Error(locale.configEmpty);
	}

	// 验证每个项目
	const validatedItems: CountdownItems = [];
	for (let i = 0; i < items.length; i++) {
		const validatedItem = validateCountdownItem(items[i], i, language);
		validatedItems.push(validatedItem);
	}

	return validatedItems;
};

/**
 * 解析自定义文本格式（不包含验证）
 * 格式：日期 | 标题 | 颜色 | 格式
 * 例如：2025-10-25 | 回国 | #2c7be5 | MM月DD日
 */
export const parseCustomFormat = (
	source: string,
	language: SupportedLanguage = "en",
): CountdownItems => {
	const locale = getLocale(language);
	const lines = source
		.trim()
		.split("\n")
		.filter((line) => line.trim());

	if (lines.length === 0) {
		throw new Error(locale.configEmpty);
	}

	const items: CountdownItems = [];
	let countdownIndex = 0; // 跟踪倒计时项目的索引（排除注释行）

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		// 如果第一个字符是 # 表示注释
		if (line.trim().startsWith("#")) {
			continue; // 跳过注释行
		}

		countdownIndex++; // 增加倒计时项目计数
		const parts = line.split("|").map((part) => part.trim());

		if (parts.length < 2) {
			throw new Error(locale.formatError(countdownIndex, line));
		}

		const item: CountdownItem = {
			date: parts[0],
			title: parts[1] || locale.unnamedEvent,
		};

		// 如果有第三部分，作为颜色
		if (parts[2]) {
			item.color = parts[2];
		}

		// 如果有第四部分，作为日期格式
		if (parts[3]) {
			item.format = parts[3];
		}

		items.push(item);
	}

	return items;
};
