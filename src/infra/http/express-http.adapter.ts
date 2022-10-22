import { HTTP, HTTPMethod } from './http';
import express, { Request, Response } from 'express';
import { Logger } from '../logger/logger';
import { HTTPError, HTTPErrorCodes } from './error';

export class ExpressAdapter implements HTTP {
	private readonly app: express.Express;
	constructor(private readonly logger: Logger) {
		this.app = express();
		this.app.use(express.json());
	}

	on(
		method: HTTPMethod,
		url: string,
		callback: (params: unknown, body: unknown) => unknown,
	): void {
		this.app[method](url, async (req: Request, res: Response) => {
			this.logger.info(
				`[ExpressAdapter] handling ${method.toUpperCase()} @ ${url}`,
			);
			try {
				const response = await callback(req.params, req.body);
				res.json(response);
			} catch (error) {
				if (error instanceof HTTPError) {
					res.status(error.statusCode).send(error);
				} else {
					res.status(HTTPErrorCodes.INTERNAL_SERVER_ERROR).send();
				}
			}
		});
	}
	listen(port: number): void {
		this.app.listen(port, () => {
			this.logger.info(`[ExpressAdapter] listening on PORT:${port}`);
		});
	}
}
