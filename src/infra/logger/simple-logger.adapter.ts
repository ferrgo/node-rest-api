import { Logger } from './logger';

export class SimpleLogger implements Logger {
	public info(message: string, ...optionalParams: unknown[]): void {
		const now = new Date();
		console.log(`[${now.toISOString()}]${message}`, ...optionalParams);
	}
}
