export interface Logger {
	info(message: string, ...optionalParams: unknown[]): void;
}
