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
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}
