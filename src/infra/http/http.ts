export interface HTTP {
	on(
		method: HTTPMethod,
		url: string,
		callback: (params: unknown, body: unknown) => unknown,
	): void;
	listen(port: number): void;
}

export enum HTTPMethod {
	GET = 'get',
}
