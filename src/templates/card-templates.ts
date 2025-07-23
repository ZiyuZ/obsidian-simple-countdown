import type { Dayjs } from "dayjs";

/**
 * 倒计时卡片模板
 */
export const createCountdownCard = (
	date: Dayjs,
	title: string,
	color: string,
	timeText: string,
	format: string = "YYYY-MM-DD",
	dateFontSize: number = 14,
	titleFontSize: number = 26,
	timeFontSize: number = 24,
): string => {
	return `
		<div style="background-color: ${color}; color: white; padding: 20px; position: relative; min-height: 80px; display: flex; align-items: center; justify-content: center;">
			<div style="position: absolute; top: 10px; left: 16px; font-size: ${dateFontSize}px; opacity: 0.9;">${date.format(format)}</div>
			<div style="font-size: ${titleFontSize}px; font-weight: bold; text-align: center; margin-top: 16px;">${title}</div>
		</div>
		<div class="countdown-time" style="background-color: white; color: #333; padding: 32px 0; text-align: center; font-size: ${timeFontSize}px; font-weight: bold;">
			${timeText}
		</div>
	`;
};

/**
 * 倒计时容器的样式配置
 */
export const containerStyles = {
	display: "flex",
	justifyContent: "center",
	flexWrap: "wrap",
	gap: "24px",
	margin: "12px auto",
	maxWidth: "100%",
} as const;

/**
 * 倒计时卡片的样式配置
 */
export const cardStyles = {
	width: "260px",
	borderRadius: "12px",
	overflow: "hidden",
	boxShadow: "0 0 10px rgba(0,0,0,0.15)",
	fontFamily: "sans-serif",
	margin: "12px",
} as const;
