import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import {
  type MarkdownPostProcessorContext,
  Plugin,
} from 'obsidian';

import { UPDATE_INTERVAL } from './constants';
import {
  getLocale,
  type LocaleStrings,
} from './locale';
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
	// 存储所有活动的倒计时容器，用于设置更新时重新渲染
	private activeContainers: Set<{
		container: HTMLElement;
		source: string;
		lastRenderedSettings: string;
	}> = new Set();

	// 全局 MutationObserver，避免为每个容器创建单独的观察者
	private globalObserver: MutationObserver | null = null;

	async onload() {
		// 加载设置
		await this.loadSettings();

		// 添加设置标签页
		this.addSettingTab(new CountdownSettingTab(this.app, this));

		// 初始化全局观察者
		this.initGlobalObserver();

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
		// 清理全局观察者
		if (this.globalObserver) {
			this.globalObserver.disconnect();
			this.globalObserver = null;
		}
		// console.log("Countdown Widget 插件已卸载");
	}

	/**
	 * 初始化全局 MutationObserver
	 */
	private initGlobalObserver(): void {
		this.globalObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (let i = 0; i < mutation.removedNodes.length; i++) {
					const removedNode = mutation.removedNodes[i];

					// 检查哪些容器被移除了
					for (const containerData of this.activeContainers) {
						const { container } = containerData;
						if (
							removedNode === container ||
							(removedNode as Element)?.contains?.(container)
						) {
							this.activeContainers.delete(containerData);
						}
					}
				}
			}
		});

		// 监听整个文档的节点变化
		this.globalObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
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
	 * 更新所有现有的倒计时容器
	 * 当外观设置（颜色、字体大小、日期格式等）发生变化时调用
	 */
	refreshAllCards(): void {
		const currentSettingsHash = this.getSettingsHash();

		for (const containerData of this.activeContainers) {
			const { container, source, lastRenderedSettings } = containerData;

			// 如果设置没有变化，跳过更新
			if (lastRenderedSettings === currentSettingsHash) {
				continue;
			}

			// 清空容器并重新渲染
			container.innerHTML = "";
			this.renderCountdownContent(source, container);

			// 更新最后渲染的设置哈希
			containerData.lastRenderedSettings = currentSettingsHash;
		}
	}

	/**
	 * 获取当前设置的哈希值，用于检测设置变化
	 */
	private getSettingsHash(): string {
		// 直接序列化所有设置，简单但可能有轻微性能影响
		return JSON.stringify(this.settings);
	}

	/**
	 * 处理倒计时代码块
	 */
	private processCountdownBlock(source: string, el: HTMLElement): void {
		// 创建容器并记录源码，用于后续刷新
		const containerData = {
			container: el,
			source: source,
			lastRenderedSettings: this.getSettingsHash(),
		};

		this.activeContainers.add(containerData);

		// 渲染内容
		this.renderCountdownContent(source, el);
	}
	/**
	 * 渲染倒计时内容
	 */
	private renderCountdownContent(source: string, el: HTMLElement): void {
		let rawItems: CountdownItems;
		const locale = getLocale(this.settings.language);
		// console.log("处理倒计时代码块\n", source);

		try {
			// 移除注释和前后空白字符
			const cleanedSource = source
				.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "") // 移除注释
				.trim(); // 移除前后空白字符

			// 检查第一个非空字符来判断格式类型
			const firstChar = cleanedSource.charAt(0);

			if (firstChar === "[" || firstChar === "{") {
				// JSON 格式 - 直接解析
				const parsed = JSON.parse(cleanedSource);

				// 如果是单个对象（{...}），包装成数组
				rawItems = firstChar === "{" ? [parsed] : parsed;
				// console.log("解析为JSON格式\n", rawItems);
			} else {
				// 自定义文本格式
				rawItems = parseCustomFormat(source, this.settings.language);
				// console.log("解析为文本格式\n", rawItems);
			}
		} catch (parseError) {
			const errorMessage =
				parseError instanceof Error ? parseError.message : locale.unknownError;
			this.showErrorAlert(el, locale.configFormatError, errorMessage);
			return;
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

				// 为每个卡片设置自动更新
				if (this.settings.autoUpdate) {
					this.setupCardAutoUpdate(card, item);
				}
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

		// 应用默认值
		const color = item.color || this.settings.defaultColor;
		const format = item.format || this.settings.defaultDateFormat;

		// 创建卡片元素
		const card = document.createElement("div");
		Object.assign(card.style, cardStyles);

		// 设置卡片内容（初始渲染）
		this.updateCardContent(card, item, date, color, format, locale);

		return card;
	}

	/**
	 * 更新卡片内容
	 */
	private updateCardContent(
		card: HTMLElement,
		item: CountdownItem,
		date: dayjs.Dayjs,
		color: string,
		format: string,
		locale: LocaleStrings,
	): void {
		const now = dayjs();
		const diffMs = date.diff(now);
		const past = diffMs < 0;
		const absDiff = Math.abs(diffMs);
		const dur = dayjs.duration(absDiff);

		// 计算显示文本
		const newText = calculateTimeText(past, absDiff, dur, locale.timeUnits);

		// 获取当前显示的倒计时文本
		const timeElement = card.querySelector(".countdown-time");
		const currentText = timeElement ? timeElement.textContent : "";

		// 只有当文本发生变化时才更新DOM
		if (currentText !== newText) {
			// 设置卡片内容
			card.innerHTML = createCountdownCard(
				date,
				item.title,
				color,
				newText,
				format,
				this.settings.dateFontSize,
				this.settings.titleFontSize,
				this.settings.timeFontSize,
			);
		}
	}

	/**
	 * 设置卡片自动更新
	 */
	private setupCardAutoUpdate(card: HTMLElement, item: CountdownItem): void {
		const locale = getLocale(this.settings.language);
		const date = dayjs(item.date);
		const color = item.color || this.settings.defaultColor;
		const format = item.format || this.settings.defaultDateFormat;

		// 每秒更新一次倒计时
		const updateInterval = window.setInterval(() => {
			this.updateCardContent(card, item, date, color, format, locale);
		}, UPDATE_INTERVAL);

		// 注册定时器，插件卸载时会自动清理
		this.registerInterval(updateInterval);
	}
}
