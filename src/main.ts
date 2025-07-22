import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import {
  type MarkdownPostProcessorContext,
  Plugin,
} from 'obsidian';

import { getLocale } from './locale';
import {
  parseCustomFormat,
  validateCountdownItems,
} from './parsers/countdown-parser';
import {
  type CountdownSettings,
  CountdownSettingTab,
  DEFAULT_SETTINGS,
} from './settings';
// 导入模板和工具函数
import { createErrorAlert } from './templates/alert-templates';
import {
  cardStyles,
  containerStyles,
  createCountdownCard,
} from './templates/card-templates';
import type {
  CountdownItem,
  CountdownItems,
} from './types';
import { calculateTimeText } from './utils/time-utils';

// 扩展dayjs以支持duration功能
dayjs.extend(duration);
// 扩展dayjs以支持高级格式化功能
dayjs.extend(advancedFormat);

export default class CountdownPlugin extends Plugin {
	settings: CountdownSettings;

	async onload() {
		// 加载设置
		await this.loadSettings();

		// 添加设置标签页
		this.addSettingTab(new CountdownSettingTab(this.app, this));

		// console.log("Countdown Widget 插件已加载");

		// 注册markdown代码块处理器
		this.registerMarkdownCodeBlockProcessor(
			"countdown",
			(source: string, el: HTMLElement, _ctx: MarkdownPostProcessorContext) => {
				this.processCountdownBlock(source, el);
			},
		);
	}

	onunload() {
		// console.log("Countdown Widget 插件已卸载");
	}

	/**
	 * 加载设置
	 */
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	/**
	 * 保存设置
	 */
	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * 处理倒计时代码块
	 */
	private processCountdownBlock(source: string, el: HTMLElement): void {
		let rawItems: CountdownItems;
		const locale = getLocale(this.settings.language);
		// console.log("处理倒计时代码块\n", source);

		// 解析配置 - 支持两种格式：JSON 和自定义文本格式
		try {
			// 首先尝试作为JSON解析
			rawItems = JSON.parse(source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")); // 移除注释
			// console.log("解析为JSON格式\n", rawItems);
		} catch (_jsonError) {
			// 如果JSON解析失败，尝试解析自定义文本格式
			try {
				rawItems = parseCustomFormat(source, this.settings.language);
			} catch (parseError) {
				const errorMessage =
					parseError instanceof Error
						? parseError.message
						: locale.unknownError;
				this.showErrorAlert(el, locale.configFormatError, errorMessage);
				return;
			}
		}

		// 统一验证配置（对两种格式都进行相同的验证）
		let items: CountdownItems;
		try {
			items = validateCountdownItems(rawItems, this.settings.language);
		} catch (validationError) {
			const errorMessage =
				validationError instanceof Error
					? validationError.message
					: locale.unknownError;
			this.showErrorAlert(el, locale.configFormatError, errorMessage);
			return;
		}

		// 创建容器
		const container = this.createContainer();

		// 为每个倒计时项创建卡片
		items.forEach((item: CountdownItem) => {
			try {
				const card = this.createCountdownCard(item);
				container.appendChild(card);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : locale.unknownError;
				this.showErrorAlert(el, locale.cardCreationFailed, errorMessage);
				return;
			}
		});

		el.appendChild(container);
	}

	/**
	 * 显示错误提示框
	 */
	private showErrorAlert(
		el: HTMLElement,
		title: string,
		message: string,
	): void {
		el.innerHTML = createErrorAlert(title, message);
	}

	/**
	 * 创建倒计时容器
	 */
	private createContainer(): HTMLElement {
		const container = document.createElement("div");
		Object.assign(container.style, containerStyles);
		return container;
	}

	/**
	 * 创建倒计时卡片
	 */
	private createCountdownCard(item: CountdownItem): HTMLElement {
		const locale = getLocale(this.settings.language);

		// 验证必需字段
		if (!item.title || item.title.trim() === "") {
			throw new Error(locale.titleRequired);
		}

		const date = dayjs(item.date);
		const now = dayjs();
		const diffMs = date.diff(now);
		const past = diffMs < 0;
		const absDiff = Math.abs(diffMs);
		const dur = dayjs.duration(absDiff);

		// 计算显示文本
		const text = calculateTimeText(past, absDiff, dur, locale.timeUnits);

		// 应用默认值
		const color = item.color || this.settings.defaultColor;
		const format = item.format || this.settings.defaultDateFormat;

		// 创建卡片元素
		const card = document.createElement("div");
		Object.assign(card.style, cardStyles);

		// 设置卡片内容
		card.innerHTML = createCountdownCard(
			date,
			item.title,
			color,
			text,
			format,
			this.settings.dateFontSize,
			this.settings.titleFontSize,
			this.settings.timeFontSize,
		);

		return card;
	}
}
