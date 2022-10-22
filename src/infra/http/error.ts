export class HTTPError extends Error {
	constructor(
		public readonly errorMessage: string,
		public readonly statusCode: HTTPErrorCodes,
	) {
		super(`Error code:${statusCode} message:${errorMessage}`);
		this.name = HTTPErrorCodes[statusCode];
	}
}

export enum HTTPErrorCodes {
	NOT_FOUND = 404,
	BAD_REQUEST = 400,
	INTERNAL_SERVER_ERROR = 500,
}
