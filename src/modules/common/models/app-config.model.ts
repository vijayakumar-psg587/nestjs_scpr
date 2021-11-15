export class AppConfigModel {
	host: string;
	port: string | number;
	timeout: number;
	retries: number;
	maxRedirects: number;
	contextPath: string;
	appVersion: string;
	maxSockets?: number;
}
