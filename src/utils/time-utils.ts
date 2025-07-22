import type dayjs from "dayjs";

import type { LocaleStrings } from "../locale";

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
		return `<strong>${timeUnits.expired} ${pastDays} ${pastDays === 1 ? timeUnits.day : timeUnits.days}</strong>`;
	} else {
		// 超过7天只显示天数
		if (absDiff >= 7 * 24 * 60 * 60 * 1000) {
			const days = Math.ceil(absDiff / (1000 * 60 * 60 * 24));
			return `<strong>${days} ${days === 1 ? timeUnits.day : timeUnits.days}</strong>`;
		}
		// 超过1天显示天数和小时
		else if (absDiff >= 24 * 60 * 60 * 1000) {
			const days = Math.floor(dur.asDays());
			const hours = dur.hours();
			return `<strong>${days} ${days === 1 ? timeUnits.day : timeUnits.days} ${hours} ${hours === 1 ? timeUnits.hour : timeUnits.hours}</strong>`;
		}
		// 不足1天显示小时和分钟
		else if (absDiff >= 60 * 60 * 1000) {
			const hours = dur.hours();
			const minutes = dur.minutes();
			return `<strong>${hours} ${hours === 1 ? timeUnits.hour : timeUnits.hours} ${minutes} ${minutes === 1 ? timeUnits.minute : timeUnits.minutes}</strong>`;
		}
		// 不足一小时显示分钟
		else {
			const minutes = dur.minutes();
			return `<strong>${minutes} ${minutes === 1 ? timeUnits.minute : timeUnits.minutes}</strong>`;
		}
	}
};
