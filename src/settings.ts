import {
  type App,
  type ColorComponent,
  PluginSettingTab,
  Setting,
  type TextComponent,
} from 'obsidian';

import {
  detectLanguage,
  getLocale,
  type SupportedLanguage,
} from './locale';
import type CountdownPlugin from './main';

/**
 * 插件设置接口
 */
export interface CountdownSettings {
	defaultDateFormat: string;
	defaultColor: string;
	language: SupportedLanguage;
	// 字体大小设置
	dateFontSize: number;
	titleFontSize: number;
	timeFontSize: number;
}

/**
 * 默认设置
 */
export const DEFAULT_SETTINGS: CountdownSettings = {
	defaultDateFormat: "YYYY-MM-DD",
	defaultColor: "#007bff",
	language: detectLanguage(),
	dateFontSize: 14,
	titleFontSize: 26,
	timeFontSize: 24,
};

/**
 * 设置标签页类
 */
export class CountdownSettingTab extends PluginSettingTab {
	plugin: CountdownPlugin;

	constructor(app: App, plugin: CountdownPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const locale = getLocale(this.plugin.settings.language);

		containerEl.empty();

		// 标题
		containerEl.createEl("h1", { text: locale.settingsTitle });

		// 使用说明内容
		const instructionsEl = containerEl.createEl("div", {
			cls: "setting-item-description",
		});
		instructionsEl.innerHTML = `
			<div style="
				background-color: var(--background-secondary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 6px;
				padding: 12px;
				margin: -10px 0 5px 0;
				font-size: 14px;
				line-height: 1.5;
			">
				${locale.refreshInstructions}
			</div>
		`;

		// 语言选择
		new Setting(containerEl)
			.setName("Language / 语言")
			.setDesc("Choose your preferred language / 选择您的首选语言")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("en", "English")
					.addOption("zh-CN", "中文")
					.setValue(this.plugin.settings.language)
					.onChange(async (value: SupportedLanguage) => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染界面
					}),
			);

		// 日期格式设置
		new Setting(containerEl)
			.setName(locale.defaultDateFormat)
			.setDesc(locale.defaultDateFormatDesc)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(this.plugin.settings.defaultDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.defaultDateFormat = value || "YYYY-MM-DD";
						await this.plugin.saveSettings();
					}),
			);

		// 示例格式说明
		const formatExamples = containerEl.createEl("div", {
			cls: "setting-item-description",
		});

		const isEnglish = this.plugin.settings.language === "en";

		formatExamples.innerHTML = isEnglish
			? `
				<p><strong>${locale.formatExamples}:</strong></p>
				<ul>
					<li><code>YYYY-MM-DD</code> → 2025-07-22</li>
					<li><code>MM/DD/YYYY</code> → 07/22/2025</li>
					<li><code>DD/MM/YYYY</code> → 22/07/2025</li>
					<li><code>MMM Do, YYYY</code> → Jul 22nd, 2025</li>
					<li><code>dddd</code> → Tuesday</li>
				</ul>
				<p>For more formats, see <a href="https://day.js.org/docs/en/display/format" target="_blank">dayjs formatting docs</a></p>

			`
			: `
				<p><strong>${locale.formatExamples}：</strong></p>
				<ul>
					<li><code>YYYY-MM-DD</code> → 2025-07-22</li>
					<li><code>MM月DD日</code> → 07月22日</li>
					<li><code>MM/DD/YYYY</code> → 07/22/2025</li>
					<li><code>MMM Do, YYYY</code> → Jul 22nd, 2025</li>
					<li><code>dddd</code> → Tuesday</li>
				</ul>
				<p>更多格式请参考 <a href="https://day.js.org/docs/en/display/format" target="_blank">dayjs 格式化文档</a></p>
			`;

		// 默认颜色设置 - 同时提供颜色选择器和文本输入
		const colorSetting = new Setting(containerEl)
			.setName(locale.defaultColor)
			.setDesc(locale.defaultColorDesc);

		// 声明变量用于组件间同步
		let textInput: TextComponent;
		let colorPicker: ColorComponent;

		colorSetting
			.addColorPicker((picker) => {
				colorPicker = picker
					.setValue(this.plugin.settings.defaultColor)
					.onChange(async (value) => {
						this.plugin.settings.defaultColor = value;
						await this.plugin.saveSettings();
						// 同步更新文本输入框
						if (textInput) {
							textInput.setValue(value);
						}
					});
				return picker;
			})
			.addText((text) => {
				textInput = text
					.setPlaceholder("#007bff")
					.setValue(this.plugin.settings.defaultColor);

				// 使用 inputEl 的 blur 事件来避免输入过程中的干扰
				textInput.inputEl.addEventListener("blur", async () => {
					const value = textInput.getValue();

					if (!value) {
						// 空值时使用默认颜色
						const defaultColor = "#007bff";
						this.plugin.settings.defaultColor = defaultColor;
						await this.plugin.saveSettings();
						textInput.setValue(defaultColor);
						if (colorPicker) {
							colorPicker.setValue(defaultColor);
						}
						return;
					}

					// 检查是否是完整的有效颜色格式
					if (value.match(/^#[0-9a-fA-F]{6}$/)) {
						// 6位格式，直接保存并同步
						this.plugin.settings.defaultColor = value;
						await this.plugin.saveSettings();
						if (colorPicker) {
							colorPicker.setValue(value);
						}
					} else if (value.match(/^#[0-9a-fA-F]{3}$/)) {
						// 3位格式，转换为6位格式
						const expandedColor = value.replace(
							/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
							"#$1$1$2$2$3$3",
						);
						this.plugin.settings.defaultColor = expandedColor;
						await this.plugin.saveSettings();
						// 更新输入框显示转换后的6位格式
						textInput.setValue(expandedColor);
						if (colorPicker) {
							colorPicker.setValue(expandedColor);
						}
					} else {
						// 无效格式，恢复到之前保存的值
						textInput.setValue(this.plugin.settings.defaultColor);
					}
				});

				return text;
			});

		// 颜色预览
		const colorPreview = containerEl.createEl("div", {
			cls: "setting-item-description",
		});
		colorPreview.innerHTML = `
			<p><strong>${locale.colorExamples}:</strong></p>
			<div style="display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap;">
				<div style="background: #007bff; color: white; padding: 5px 10px; border-radius: 4px;">#007bff ${isEnglish ? "Blue" : "蓝色"}</div>
				<div style="background: #28a745; color: white; padding: 5px 10px; border-radius: 4px;">#28a745 ${isEnglish ? "Green" : "绿色"}</div>
				<div style="background: #dc3545; color: white; padding: 5px 10px; border-radius: 4px;">#dc3545 ${isEnglish ? "Red" : "红色"}</div>
				<div style="background: #ffc107; color: white; padding: 5px 10px; border-radius: 4px;">#ffc107 ${isEnglish ? "Yellow" : "黄色"}</div>
				<div style="background: #333; color: white; padding: 5px 10px; border-radius: 4px;">#333 ${isEnglish ? "Black" : "黑色"}</div>
			</div>
		`;

		// 字体大小设置分隔线
		containerEl.createEl("h2", { text: locale.fontSizeSettings });

		// 日期字体大小设置
		new Setting(containerEl)
			.setName(locale.dateFontSize)
			.setDesc(locale.dateFontSizeDesc)
			.addSlider((slider) =>
				slider
					.setLimits(10, 24, 1)
					.setValue(this.plugin.settings.dateFontSize)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.dateFontSize = value;
						await this.plugin.saveSettings();
					}),
			);

		// 标题字体大小设置
		new Setting(containerEl)
			.setName(locale.titleFontSize)
			.setDesc(locale.titleFontSizeDesc)
			.addSlider((slider) =>
				slider
					.setLimits(16, 36, 1)
					.setValue(this.plugin.settings.titleFontSize)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.titleFontSize = value;
						await this.plugin.saveSettings();
					}),
			);

		// 时间字体大小设置
		new Setting(containerEl)
			.setName(locale.timeFontSize)
			.setDesc(locale.timeFontSizeDesc)
			.addSlider((slider) =>
				slider
					.setLimits(16, 32, 1)
					.setValue(this.plugin.settings.timeFontSize)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.timeFontSize = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
