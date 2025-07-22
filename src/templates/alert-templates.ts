/**
 * 错误提示框模板
 */
export const createErrorAlert = (title: string, message: string): string => {
	return `
		<div style="
			background: linear-gradient(135deg, #fef0f0 0%, #fdf2f2 100%);
			border: 1px solid #f56565;
			border-radius: 8px;
			padding: 16px;
			margin: 10px 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			box-shadow: 0 2px 8px rgba(245, 101, 101, 0.1);
		">
			<div style="
				display: flex;
				align-items: flex-start;
				gap: 12px;
			">
				<div style="
					flex-shrink: 0;
					width: 20px;
					height: 20px;
					margin-top: 2px;
				">
					<svg style="width: 20px; height: 20px; color: #f56565;" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<div style="flex: 1; min-width: 0;">
					<div style="
						font-weight: 600;
						color: #c53030;
						font-size: 14px;
						margin-bottom: 4px;
					">${title}</div>
					<div style="
						color: #742a2a;
						font-size: 13px;
						line-height: 1.5;
					">${message}</div>
				</div>
			</div>
		</div>
	`;
};

/**
 * 警告提示框模板
 */
export const createWarningAlert = (title: string, message: string): string => {
	return `
		<div style="
			background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
			border: 1px solid #f59e0b;
			border-radius: 8px;
			padding: 16px;
			margin: 10px 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
		">
			<div style="
				display: flex;
				align-items: flex-start;
				gap: 12px;
			">
				<div style="
					flex-shrink: 0;
					width: 20px;
					height: 20px;
					margin-top: 2px;
				">
					<svg style="width: 20px; height: 20px; color: #f59e0b;" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<div style="flex: 1; min-width: 0;">
					<div style="
						font-weight: 600;
						color: #92400e;
						font-size: 14px;
						margin-bottom: 4px;
					">${title}</div>
					<div style="
						color: #78350f;
						font-size: 13px;
						line-height: 1.5;
					">${message}</div>
				</div>
			</div>
		</div>
	`;
};

/**
 * 成功提示框模板
 */
export const createSuccessAlert = (title: string, message: string): string => {
	return `
		<div style="
			background: linear-gradient(135deg, #f0fff4 0%, #f0fdf4 100%);
			border: 1px solid #38a169;
			border-radius: 8px;
			padding: 16px;
			margin: 10px 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			box-shadow: 0 2px 8px rgba(56, 161, 105, 0.1);
		">
			<div style="
				display: flex;
				align-items: flex-start;
				gap: 12px;
			">
				<div style="
					flex-shrink: 0;
					width: 20px;
					height: 20px;
					margin-top: 2px;
				">
					<svg style="width: 20px; height: 20px; color: #38a169;" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<div style="flex: 1; min-width: 0;">
					<div style="
						font-weight: 600;
						color: #276749;
						font-size: 14px;
						margin-bottom: 4px;
					">${title}</div>
					<div style="
						color: #2d5737;
						font-size: 13px;
						line-height: 1.5;
					">${message}</div>
				</div>
			</div>
		</div>
	`;
};
