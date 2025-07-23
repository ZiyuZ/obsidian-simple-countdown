import type dayjs from 'dayjs';

import type { LocaleStrings } from '../locale';

/**
 * 格式化时间单位（处理单复数）
 */
const formatTimeUnit = (
	value: number,
	singularUnit: string,
	pluralUnit: string,
): string => {
	return `${value} ${value === 1 ? singularUnit : pluralUnit}`;
};

/**
 * 将多个时间部分组合成最终显示文本
 */
const formatTimeParts = (parts: string[]): string => {
	return `<strong>${parts.join(" ")}</strong>`;
};

/**
 * 计算时间显示文本
 */
export const calculateTimeText = (
	past: boolean,
	absDiff: number,
	dur: ReturnType<typeof dayjs.duration>,
	timeUnits: LocaleStrings["timeUnits"],
): string => {
	if (past) {
		const pastDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
		return formatTimeParts([
			timeUnits.expired,
			formatTimeUnit(pastDays, timeUnits.day, timeUnits.days),
		]);
	}

	// 超过7天只显示天数
	if (absDiff >= 7 * 24 * 60 * 60 * 1000) {
		const days = Math.ceil(absDiff / (1000 * 60 * 60 * 24));
		return formatTimeParts([
			formatTimeUnit(days, timeUnits.day, timeUnits.days),
		]);
	}

	// 超过1天显示天数和小时
	if (absDiff >= 24 * 60 * 60 * 1000) {
		const days = Math.floor(dur.asDays());
		const hours = dur.hours();
		return formatTimeParts([
			formatTimeUnit(days, timeUnits.day, timeUnits.days),
			formatTimeUnit(hours, timeUnits.hour, timeUnits.hours),
		]);
	}

	// 不足1天显示小时和分钟
	if (absDiff >= 60 * 60 * 1000) {
		const hours = dur.hours();
		const minutes = dur.minutes();
		return formatTimeParts([
			formatTimeUnit(hours, timeUnits.hour, timeUnits.hours),
			formatTimeUnit(minutes, timeUnits.minute, timeUnits.minutes),
		]);
	}

	// 不足一小时显示分钟和秒钟
	const minutes = dur.minutes();
	const seconds = dur.seconds();
	return formatTimeParts([
		formatTimeUnit(minutes, timeUnits.minute, timeUnits.minutes),
		formatTimeUnit(seconds, timeUnits.second, timeUnits.seconds),
	]);
};
