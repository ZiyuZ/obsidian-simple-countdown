/**
 * 多语言支持
 */

export type SupportedLanguage = "en" | "zh-CN";

export interface LocaleStrings {
	// Settings
	settingsTitle: string;
	defaultDateFormat: string;
	defaultDateFormatDesc: string;
	defaultColor: string;
	defaultColorDesc: string;
	formatExamples: string;
	colorExamples: string;

	// Font size settings
	fontSizeSettings: string;
	dateFontSize: string;
	dateFontSizeDesc: string;
	titleFontSize: string;
	titleFontSizeDesc: string;
	timeFontSize: string;
	timeFontSizeDesc: string;

	// Auto update settings
	autoUpdateSettings: string;
	autoUpdate: string;
	autoUpdateDesc: string;

	// Usage instructions
	refreshInstructions: string;

	// Error messages
	configEmpty: string;
	configFormatError: string;
	dataTypeError: string;
	arrayFormatRequired: string;
	unknownError: string;
	formatError: (index: number, content: string) => string;
	dateInvalid: (index: number, date: string) => string;
	colorInvalid: (index: number, color: string) => string;
	titleRequired: string;
	cardCreationFailed: string;

	// UI
	unnamedEvent: string;

	// Time units
	timeUnits: {
		year: string;
		years: string;
		month: string;
		months: string;
		day: string;
		days: string;
		hour: string;
		hours: string;
		minute: string;
		minutes: string;
		second: string;
		seconds: string;
		expired: string;
	};
}
export const locales: Record<SupportedLanguage, LocaleStrings> = {
	en: {
		settingsTitle: "Simple Countdown Widget Settings",
		defaultDateFormat: "Default Date Format",
		defaultDateFormatDesc:
			"Set the date format displayed on cards. Use dayjs formatting syntax, e.g., YYYY-MM-DD, MMM Do YYYY, etc.",
		defaultColor: "Default Card Color",
		defaultColorDesc:
			"Set the default background color for countdown cards using hex color values",
		formatExamples: "Format Examples",
		colorExamples: "Color Examples",

		fontSizeSettings: "Font Size Settings",
		dateFontSize: "Date Font Size",
		dateFontSizeDesc:
			"Set the font size for the date text on cards (in pixels)",
		titleFontSize: "Title Font Size",
		titleFontSizeDesc:
			"Set the font size for the title text on cards (in pixels)",
		timeFontSize: "Time Font Size",
		timeFontSizeDesc:
			"Set the font size for the countdown time text (in pixels)",

		autoUpdateSettings: "Auto Update Settings",
		autoUpdate: "Auto Update",
		autoUpdateDesc:
			"Enable automatic updates of countdown timers every second. When disabled, countdowns will only update when the note is refreshed.",

		refreshInstructions: `
			💡 Tip: This plugin supports automatic countdown updates every second. 
					You can enable/disable auto-update in the settings below. 
					When auto-update is disabled, countdowns will only update when the note is refreshed.`,

		configEmpty: "Countdown items list is empty",
		configFormatError: "Countdown items format error",
		dataTypeError: "Data type error",
		arrayFormatRequired: "Countdown items must be in array format",
		unknownError: "Unknown error",
		formatError: (index: number, content: string) =>
			`Countdown item ${index} has a format error: "${content}"<br>Correct format: <code>date | title | color(optional) | format(optional)</code>`,
		dateInvalid: (index: number, date: string) =>
			`Countdown item ${index} has an invalid date format: "${date}"<br>Please use a valid date format, e.g., <code>2025-07-25</code> or <code>2025-07-25T23:00</code>`,
		colorInvalid: (index: number, color: string) =>
			`Countdown item ${index} has an invalid color format: "${color}"<br>Please use hex color format, e.g., <code>#ff0000</code> or <code>#f00</code>`,
		titleRequired: "Title cannot be empty",
		cardCreationFailed: "Card creation failed",

		unnamedEvent: "Unnamed Event",

		timeUnits: {
			year: "year",
			years: "years",
			month: "month",
			months: "months",
			day: "day",
			days: "days",
			hour: "h",
			hours: "h",
			minute: "min",
			minutes: "min",
			second: "s",
			seconds: "s",
			expired: "Expired",
		},
	},

	"zh-CN": {
		settingsTitle: "简单倒计时小组件设置",
		defaultDateFormat: "默认日期格式",
		defaultDateFormatDesc:
			"设置卡片上显示的日期格式。使用 dayjs 格式化语法，例如：YYYY-MM-DD, MM月DD日, DD/MM/YYYY 等",
		defaultColor: "默认卡片颜色",
		defaultColorDesc: "设置倒计时卡片的默认背景色，使用十六进制颜色值",
		formatExamples: "常用格式示例",
		colorExamples: "颜色示例",

		fontSizeSettings: "字体大小设置",
		dateFontSize: "日期字体大小",
		dateFontSizeDesc: "设置卡片上日期文字的字体大小（像素）",
		titleFontSize: "标题字体大小",
		titleFontSizeDesc: "设置卡片上标题文字的字体大小（像素）",
		timeFontSize: "时间字体大小",
		timeFontSizeDesc: "设置倒计时时间文字的字体大小（像素）",

		autoUpdateSettings: "自动更新设置",
		autoUpdate: "自动更新",
		autoUpdateDesc:
			"启用倒计时每秒自动更新。关闭时，倒计时仅在笔记刷新时更新。",

		refreshInstructions: `
			💡 提示：此插件支持倒计时每秒自动更新。
					您可以在下方设置中启用/禁用自动更新功能。
					关闭自动更新时，倒计时仅在笔记刷新时更新。`,

		configEmpty: "倒计时项目列表为空",
		configFormatError: "倒计时项目格式错误",
		dataTypeError: "数据类型错误",
		arrayFormatRequired: "倒计时项目必须是数组格式",
		unknownError: "未知错误",
		formatError: (index: number, content: string) =>
			`第 ${index} 个倒计时格式错误: "${content}"<br>正确格式: <code>日期 | 标题 | 颜色(可选) | 格式(可选)</code>`,
		dateInvalid: (index: number, date: string) =>
			`第 ${index} 个倒计时日期格式无效: "${date}"<br>请使用有效的日期格式，如: <code>2025-07-25</code> 或 <code>2025-07-25T23:00</code>`,
		colorInvalid: (index: number, color: string) =>
			`第 ${index} 个倒计时颜色格式无效: "${color}"<br>请使用十六进制颜色格式，如: <code>#ff0000</code> 或 <code>#f00</code>`,
		titleRequired: "标题不能为空",
		cardCreationFailed: "卡片创建失败",

		unnamedEvent: "未命名事件",

		timeUnits: {
			year: "年",
			years: "年",
			month: "个月",
			months: "个月",
			day: "天",
			days: "天",
			hour: "小时",
			hours: "小时",
			minute: "分钟",
			minutes: "分钟",
			second: "秒",
			seconds: "秒",
			expired: "已过",
		},
	},
};

/**
 * 获取当前语言的本地化字符串
 */
export function getLocale(language: SupportedLanguage = "en"): LocaleStrings {
	return locales[language] || locales.en;
}

/**
 * 检测用户语言偏好
 */
export function detectLanguage(): SupportedLanguage {
	// 检测 Obsidian 语言设置 (如果可用)
	const obsidianLang = (
		window as unknown as {
			app?: { vault?: { adapter?: { app?: { setting?: { lang?: string } } } } };
		}
	).app?.vault?.adapter?.app?.setting?.lang;

	// 检测浏览器语言
	const browserLang =
		navigator.language ||
		(navigator as unknown as { userLanguage?: string }).userLanguage;

	// 优先使用 Obsidian 设置，然后是浏览器语言
	const lang = obsidianLang || browserLang;

	if (lang?.startsWith("zh")) {
		return "zh-CN";
	}

	return "en";
}
